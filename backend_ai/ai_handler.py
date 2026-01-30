import json
from typing import Dict, Any
import google.generativeai as genai  # Using Gemini-like API


def get_ai_response(user_input: str, system_prompt: str) -> Dict[str, Any]:
    """
    Sends user input to an LLM and returns structured intent
    
    Args:
        user_input (str): The raw input from the user
        system_prompt (str): The system prompt defining AI behavior
        
    Returns:
        dict: Structured response with intent and extracted information
    """
    
    # In a real implementation, you would call the actual LLM API
    # For demonstration purposes, we'll simulate the response
    
    # Combine system prompt and user input
    full_prompt = f"{system_prompt}\n\nUser Input: {user_input}"
    
    # Simulated response based on common patterns
    # In a real implementation, this would be replaced with actual API call
    response = simulate_llm_response(user_input)
    
    return response


def simulate_llm_response(user_input: str) -> Dict[str, Any]:
    """
    Simulates an LLM response for demonstration purposes
    In a real implementation, this would be replaced with actual API call
    """
    
    user_lower = user_input.lower()
    
    # Determine intent based on keywords
    if any(word in user_lower for word in ["add", "create", "new task", "remind me"]):
        intent = "add"
        # Extract task title (simple extraction)
        task_title = user_input.replace("Add", "").replace("add", "").replace("to", "").strip()
        
        # Check for date references
        due_date = None
        if "tomorrow" in user_lower:
            due_date = "2026-01-27"
        elif "today" in user_lower:
            due_date = "2026-01-26"
        elif "friday" in user_lower:
            due_date = "2026-01-30"
            
        return {
            "intent": intent,
            "task_title": task_title,
            "due_date": due_date,
            "response": f"I've added '{task_title}' to your todo list."
        }
    
    elif any(word in user_lower for word in ["list", "show", "all tasks", "what's on my list"]):
        return {
            "intent": "list",
            "response": "Here are your current tasks..."
        }
    
    elif any(word in user_lower for word in ["delete", "remove"]):
        # Extract task ID if mentioned
        import re
        numbers = re.findall(r'\d+', user_input)
        task_id = numbers[0] if numbers else None
        
        return {
            "intent": "delete",
            "task_id": task_id,
            "response": f"I've deleted task {task_id} from your list."
        }
    
    else:
        # Unrelated to todo management
        return {
            "intent": "unknown",
            "response": "I'm a Todo AI assistant. I can help you add, list, or delete tasks. How can I assist with your todos today?"
        }


def call_real_llm(user_input: str, system_prompt: str) -> Dict[str, Any]:
    """
    Real implementation would call the LLM API
    This is a placeholder showing how it would work
    """
    # Configure API key (would come from environment variables)
    # genai.configure(api_key="YOUR_API_KEY_HERE")
    
    # Set up the model
    # model = genai.GenerativeModel('gemini-pro', 
    #                              system_instruction=system_prompt)
    
    # Generate content
    # response = model.generate_content(user_input)
    
    # Parse and return structured response
    # return json.loads(response.text)
    
    # For now, return simulated response
    return simulate_llm_response(user_input)


# Example usage
if __name__ == "__main__":
    # Example system prompt
    system_prompt = """You are a helpful Todo AI assistant. Your job is to understand user commands and convert them into structured todo operations."""
    
    # Example user inputs
    examples = [
        "Add a task to buy groceries tomorrow",
        "List all my tasks",
        "Delete task number 3"
    ]
    
    for example in examples:
        result = get_ai_response(example, system_prompt)
        print(f"Input: {example}")
        print(f"Response: {result}")
        print("-" * 40)