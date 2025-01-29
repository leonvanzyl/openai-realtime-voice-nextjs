// Types for tool responses
interface ToolResponse {
  type: "conversation.item.create";
  item: {
    type: "function_call_output";
    call_id: string;
    output: string;
  };
}

// Types for tool functions
type ToolFunction = (args: any, callId: string) => Promise<ToolResponse>;

// Tool implementations
export const getWeather: ToolFunction = async (
  args: { location: string },
  callId: string
) => {
  console.log(`Getting weather for ${args.location}`);

  // Mock weather response - replace with actual API call
  return {
    type: "conversation.item.create",
    item: {
      type: "function_call_output",
      call_id: callId,
      output: JSON.stringify({ weather: "28 degrees" }),
    },
  };
};

// Tool registry
export const tools: Record<string, ToolFunction> = {
  get_weather: getWeather,
};

// Helper to execute a tool
export const executeTool = async (
  toolName: string,
  args: any,
  callId: string
): Promise<ToolResponse | null> => {
  const tool = tools[toolName];
  if (!tool) {
    console.warn(`Tool ${toolName} not found`);
    return null;
  }

  return await tool(args, callId);
};
