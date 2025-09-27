import google.generativeai as genai
import os
from dotenv import load_dotenv
from ap2_types import PaymentDetails # Import the structured AP2 type

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class RecommenderAgent:
    def __init__(self):
        # Mock dataset with productId for the JS client
        self.products = [
            {"name": "Hoodie Classic", "price": 0.005, "productId": "Decentralized-Hoodie"},
            {"name": "Hoodie Premium", "price": 0.007, "productId": "Premium-Hoodie"},
            {"name": "Hoodie Budget", "price": 0.003, "productId": "Budget-Hoodie"}
        ]

    def respond(self, user_message, context):
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        Analyze the user's request and the provided dataset to select the single best product.
        The user wants: "{user_message}"
        Available products: {self.products}
        Your task is to pick the best hoodie based on a balance of style and price.
        Respond ONLY with the JSON object for the selected product. Do not include any other text or markdown formatting.
        Example response: {{"name": "Hoodie Classic", "price": 0.005, "productId": "Decentralized-Hoodie"}}
        """
        response = model.generate_content(prompt)
        # Clean up potential markdown formatting from the model's response
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return {"data": cleaned_response}

class CheckoutAgent:
    def respond(self, product_info, context):
        """
        This agent now uses the structured PaymentDetails class from AP2.
        """
        # Create an instance of the structured AP2 type
        payment_details = PaymentDetails(
            productId=product_info["productId"],
            amount=str(product_info["price"])
        )
        return {
            "data": {
                "status": "Order details prepared for payment using AP2 types",
                "payment_info": payment_details # Return the object instance
            }
        }