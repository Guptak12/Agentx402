# ap2-orchestrator/agents.py
class TechnicalAgent:
    def respond(self, user_message, context):
        return {
            "data": {
                "plan": [
                    "Design MVP workflow",
                    "Prepare frontend mockup",
                    "Prepare backend skeleton",
                    "Prepare for payment integration"
                ]
            }
        }

class MVPBuilderAgent:
    def respond(self, user_message, context):
        return {
            "data": {
                "mvp_tasks": [
                    "Create frontend mockup",
                    "Implement basic backend logic",
                    "Connect to x402 payment"
                ]
            }
        }

class PaymentAgent:
    def respond(self, user_message, context):
        # Mock payment info
        return {
            "data": {
                "payment_info": {
                    "amount": 0.005,
                    "pay_to": "0x64fbc59bbbb1B43f2EdA83835610CFc233f26282",
                    "asset": "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
                }
            }
        }
