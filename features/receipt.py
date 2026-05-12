from datetime import datetime


def generate_receipt(customer_name, cart_items, order_number="ORD-1001"):
    """
    Generates a basic receipt after checkout confirmation.
    cart_items should be a list of dictionaries with:
    title, quantity, and price.
    """

    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    subtotal = 0

    print("\n===================================")
    print("        BOOKSTORE RECEIPT")
    print("===================================")
    print(f"Order Number: {order_number}")
    print(f"Date: {date}")
    print(f"Customer: {customer_name}")
    print("-----------------------------------")
    print("Items Purchased:")

    for item in cart_items:
        item_total = item["quantity"] * item["price"]
        subtotal += item_total

        print("-----------------------------------")
        print(f"Book: {item['title']}")
        print(f"Quantity: {item['quantity']}")
        print(f"Price: ${item['price']:.2f}")
        print(f"Item Total: ${item_total:.2f}")

    tax_rate = 0.0825
    tax = subtotal * tax_rate
    total = subtotal + tax

    print("-----------------------------------")
    print(f"Subtotal: ${subtotal:.2f}")
    print(f"Tax: ${tax:.2f}")
    print(f"Total: ${total:.2f}")
    print("===================================")
    print("Your order has been successfully processed.")
    print("Thank you for shopping with us!")
    print("===================================\n")


# Test data for Sprint 1
if __name__ == "__main__":
    sample_cart = [
        {"title": "The Great Gatsby", "quantity": 1, "price": 12.99},
        {"title": "To Kill a Mockingbird", "quantity": 2, "price": 14.99},
        {"title": "1984", "quantity": 1, "price": 11.50}
    ]

    generate_receipt("Leonard Farwig", sample_cart)