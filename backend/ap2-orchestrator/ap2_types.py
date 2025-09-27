from dataclasses import dataclass, asdict

@dataclass
class PaymentDetails:
    """
    A structured class for payment information, inspired by AP2 types.
    This replaces a simple dictionary.
    """
    productId: str
    amount: str

    def to_dict(self):
        """Converts the dataclass instance to a dictionary."""
        return asdict(self)