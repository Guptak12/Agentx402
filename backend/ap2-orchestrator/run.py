import os, json, subprocess, sys

# Add the AP2 library to the Python path
# This assumes run.py is in ap2-orchestrator and AP2 is in lib/AP2
lib_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lib', 'AP2', 'src'))
if lib_path not in sys.path:
    sys.path.insert(0, lib_path)

from agents import RecommenderAgent, CheckoutAgent

def main():
    # Step 0: Get interactive user input
    user_message = input("🤖 What would you like to buy today? ")

    # Step 1: Recommender Agent (Live Gemini Call)
    recommender = RecommenderAgent()
    rec_resp = recommender.respond(user_message, {})
    print("\n--- Agent 1 (Recommender) ---")
    
    try:
        product_info = json.loads(rec_resp["data"])
        print(f"✅ LLM recommends: {product_info['name']} for {product_info['price']} USDC.")
    except (json.JSONDecodeError, KeyError):
        print(f"❌ Error: Failed to decode or parse recommendation. Raw response: {rec_resp['data']}")
        return

    # Step 1.5: Get user confirmation
    confirmation = input("\n🤔 Do you want to proceed with this purchase? (y/n): ").lower()
    if confirmation != 'y':
        print("❌ Purchase cancelled by user.")
        return

    # Step 2: Checkout Agent
    checkout = CheckoutAgent()
    checkout_resp = checkout.respond(product_info, {})
    print("\n--- Agent 2 (Checkout) ---")
    print(checkout_resp["data"]["status"])

    # Step 3: Write payment.json for the JS client
    js_client_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
    os.makedirs(js_client_dir, exist_ok=True)
    payment_file = os.path.join(js_client_dir, "payment.json")

    payment_info_dict = checkout_resp["data"]["payment_info"].to_dict()

    with open(payment_file, "w") as f:
        json.dump(payment_info_dict, f, indent=2)
    print(f"\n✅ Payment info written to {payment_file}")

    # Step 4: Execute the JS Payment Agent (x402)
    print("\n--- Triggering JS Payment Agent (x402) ---")
    try:
        js_client_path = os.path.join(js_client_dir, 'client.js')
        result = subprocess.run(
            ['node', js_client_path],
            capture_output=True,
            text=True,
            check=True,
            cwd=os.path.abspath(os.path.join(js_client_dir, '..'))
        )
        print("\n--- JS Client Output ---")
        print(result.stdout)
        print("✅ End-to-end flow completed successfully.")
    except subprocess.CalledProcessError as e:
        print("\n--- ❌ JS Client Error ---")
        print(e.stderr)
    except FileNotFoundError:
        print("\n❌ Error: 'node' command not found. Please ensure Node.js is installed and in your PATH.")


if __name__ == "__main__":
    main()