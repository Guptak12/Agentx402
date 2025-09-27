import os, json, subprocess, sys
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add the AP2 library to the Python path
lib_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lib', 'AP2', 'src'))
if lib_path not in sys.path:
    sys.path.insert(0, lib_path)

from agents import RecommenderAgent, CheckoutAgent

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the frontend

@app.route('/recommend', methods=['POST'])
def recommend_product():
    """
    Endpoint for Agent 1: Takes a user prompt and returns an LLM recommendation.
    """
    data = request.get_json()
    user_message = data.get('prompt')
    if not user_message:
        return jsonify({"error": "Prompt is required"}), 400

    print(f"\n--- Agent 1 (Recommender) for prompt: '{user_message}' ---")
    recommender = RecommenderAgent()
    rec_resp = recommender.respond(user_message, {})
    
    try:
        product_info = json.loads(rec_resp["data"])
        print(f"✅ LLM recommends: {product_info['name']}")
        return jsonify(product_info)
    except (json.JSONDecodeError, KeyError):
        error_msg = f"Failed to decode or parse recommendation. Raw: {rec_resp['data']}"
        print(f"❌ Error: {error_msg}")
        return jsonify({"error": error_msg}), 500

@app.route('/checkout', methods=['POST'])
def checkout_product():
    """
    Endpoint for Agent 2 & 3: Takes product info, prepares payment, and executes.
    """
    product_info = request.get_json()
    if not product_info:
        return jsonify({"error": "Product info is required"}), 400

    # Step 2: Checkout Agent
    checkout = CheckoutAgent()
    checkout_resp = checkout.respond(product_info, {})
    print("\n--- Agent 2 (Checkout) ---")
    print(checkout_resp["data"]["status"])

    # Step 3: Write payment.json
    js_client_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
    payment_file = os.path.join(js_client_dir, "payment.json")
    payment_info_dict = checkout_resp["data"]["payment_info"].to_dict()
    with open(payment_file, "w") as f:
        json.dump(payment_info_dict, f, indent=2)
    print(f"✅ Payment info written to {payment_file}")

    # Step 4: Execute the JS Payment Agent (x402)
    print("\n--- Triggering JS Payment Agent (x402) ---")
    try:
        js_client_path = os.path.join(js_client_dir, 'client.js')
        result = subprocess.run(
            ['node', js_client_path],
            capture_output=True, text=True, check=True,
            cwd=os.path.abspath(os.path.join(js_client_dir, '..'))
        )
        print("--- JS Client Output ---")
        print(result.stdout)
        return jsonify({"status": "success", "output": result.stdout})
    except subprocess.CalledProcessError as e:
        print(f"--- ❌ JS Client Error ---\n{e.stderr}")
        return jsonify({"error": "JS client execution failed", "details": e.stderr}), 500

if __name__ == '__main__':
    # Runs the Flask server on port 5001
    app.run(port=5001, debug=True)