# ap2-orchestrator/run.py
import os
import json
from agents import TechnicalAgent, MVPBuilderAgent, PaymentAgent

def main():
    user_message = "Buy the best hoodie and deploy a demo MVP."

    agent1 = TechnicalAgent()
    agent2 = MVPBuilderAgent()
    agent3 = PaymentAgent()

    # Step 1: Technical plan
    plan_resp = agent1.respond(user_message, {})
    print("\n--- Agent 1 (Technical Plan) ---")
    print(plan_resp["data"]["plan"])

    # Step 2: MVP tasks
    mvp_resp = agent2.respond(user_message, plan_resp["data"])
    print("\n--- Agent 2 (MVP Tasks) ---")
    print(mvp_resp["data"]["mvp_tasks"])

    # Step 3: Payment info
    payment_resp = agent3.respond(user_message, mvp_resp["data"])
    print("\n--- Agent 3 (Payment Info) ---")
    print(payment_resp["data"]["payment_info"])

    # Write payment info to JS client folder
    js_client_dir = "../src"
    os.makedirs(js_client_dir, exist_ok=True)
    payment_file = os.path.join(js_client_dir, "payment.json")

    with open(payment_file, "w") as f:
        json.dump(payment_resp["data"]["payment_info"], f, indent=2)
    print(f"\n✅ Payment info written to {payment_file}")

if __name__ == "__main__":
    main()
