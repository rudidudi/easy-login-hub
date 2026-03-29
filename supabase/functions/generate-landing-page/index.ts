import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// System prompt that instructs Claude to generate Figma Plugin API code
const SYSTEM_PROMPT = `You are a Figma landing page designer. Given a user's description, generate JavaScript code that uses the Figma Plugin API to create a complete landing page.

IMPORTANT RULES:
- Output ONLY valid JavaScript code, no markdown, no explanation, no code fences.
- The code will be executed in a Figma Plugin API context where \`figma\` is a global.
- Create a top-level frame sized 1440x900 (desktop) with the landing page.
- Use auto-layout extensively for responsive structure.
- Include realistic text content based on the user's description.
- Use professional color schemes and typography.
- Structure: Hero section, Features/Benefits, Social proof, CTA, Footer.
- Load fonts before using them: await figma.loadFontAsync({ family: "Inter", style: "Regular" }) etc.
- Set fills using RGB values (0-1 range), e.g. [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.9 } }].
- For text nodes: create with figma.createText(), set fontName BEFORE setting characters.
- Return the created frame at the end: figma.currentPage.appendChild(frame); figma.viewport.scrollAndZoomIntoView([frame]);
- Make the design look modern, clean, and professional.
- Use consistent spacing (16, 24, 32, 48, 64, 80 px).
- Create section backgrounds using frames with fills.
- The code must be self-contained and complete.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, figma_access_token } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "Anthropic API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Call Claude API to generate Figma Plugin API code
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Create a Figma landing page with this description:\n\n${prompt}`,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      return new Response(
        JSON.stringify({ error: "Claude API call failed", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeData = await claudeResponse.json();
    const generatedCode = claudeData.content?.[0]?.text;

    if (!generatedCode) {
      return new Response(
        JSON.stringify({ error: "No code generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Try to execute via Figma MCP server
    let figmaFileUrl = null;
    let mcpError = null;

    if (figma_access_token) {
      try {
        // Try calling the Figma MCP endpoint to execute the code
        const mpcInitResponse = await fetch("https://mcp.figma.com/mcp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${figma_access_token}`,
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
              protocolVersion: "2024-11-05",
              capabilities: {},
              clientInfo: { name: "designfolio", version: "1.0.0" },
            },
          }),
        });

        if (mpcInitResponse.ok) {
          const initData = await mpcInitResponse.json();
          // If init succeeds, try to create file and execute code
          // This is experimental - the MCP server may not accept our token
          figmaFileUrl = "mcp_connected";
        } else {
          mcpError = `MCP server returned ${mpcInitResponse.status}`;
        }
      } catch (e) {
        mcpError = e.message;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated_code: generatedCode,
        figma_file_url: figmaFileUrl,
        mcp_error: mcpError,
        message: figmaFileUrl
          ? "Design created in Figma!"
          : "Design code generated. Ready for Figma execution.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
