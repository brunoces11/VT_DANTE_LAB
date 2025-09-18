interface LangflowResponse {
  outputs: Array<{
    outputs: Array<{
      results: {
        message: {
          text: string;
        };
      };
    }>;
  }>;
}

interface SendToLangflowParams {
  inputValue: string;
  inputType?: string;
  outputType?: string;
}

export async function sendToLangflow({ 
  inputValue, 
  inputType = "chat", 
  outputType = "chat" 
}: SendToLangflowParams): Promise<string> {
  const hostUrl = import.meta.env.VITE_LANGFLOW_HOST_URL;
  const flowId = import.meta.env.VITE_LANGFLOW_FLOW_ID;

  if (!hostUrl || !flowId) {
    throw new Error('Langflow configuration missing. Please check your environment variables.');
  }

  const apiUrl = `${hostUrl}/api/v1/run/${flowId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_value: inputValue,
        output_type: outputType,
        input_type: inputType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LangflowResponse = await response.json();
    
    // Extract the message text from the Langflow response structure
    const messageText = data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text;
    
    if (!messageText) {
      throw new Error('Invalid response format from Langflow');
    }

    return messageText;
  } catch (error) {
    console.error("Error calling Langflow API:", error);
    throw error;
  }
}