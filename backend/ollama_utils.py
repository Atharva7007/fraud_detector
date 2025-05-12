import requests
import json
import re

def get_ollama_response(prompt):
    """
    Get response from Ollama using llama3.2 model
    """
    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": "llama3.2",
                "prompt": prompt
            }
        )
        response.raise_for_status()
        
        # Collect the full response
        full_response = ""
        for line in response.iter_lines(decode_unicode=True):
            if not line:
                continue
            chunk = json.loads(line)
            full_response += chunk.get("response", "")
        
        return full_response
        
    except Exception as e:
        print(f"Error calling Ollama: {str(e)}")
        return None 