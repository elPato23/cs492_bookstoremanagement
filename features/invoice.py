from tabulate import tabulate
from sprint1_bookstore import Inventory, Book
from datetime import date, datetime


class Cart:
    def __init__(self):
        self.items = {}

    def add_item(self, book, quantity):
        if book.book_id in self.items:
            self.items[book.book_id]["quantity"] += quantity
        else:
            self.items[book.book_id] = {"book": book, "quantity": quantity}


# The invoice
def generate_invoice(cart):
    data = []
    subtotal = 0

    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for item in cart.items.values():
        book = item["book"]
        quantity = item["quantity"]

        total = book.price * quantity
        subtotal += total

        data.append(
            [
                book.book_id,
                book.title,
                quantity,
                f"${book.price:,.2f}",
                f"${total:,.2f}",
            ]
        )

    tax = subtotal * 0.0825
    grand_total = subtotal + tax

    print("\nINVOICE")
    print(f"Order Date: {date}")

    print(
        tabulate(
            data, headers=["Book ID", "Title", "Qty", "Price", "Total"], tablefmt="grid"
        )
    )

    totals = [
        ["Subtotal", f"${subtotal:,.2f}"],
        ["Tax", f"${tax:,.2f}"],
        ["Total", f"${grand_total:,.2f}"],
    ]

    print(tabulate(totals, headers=["Description", "Amount"], tablefmt="grid"))


# Inventory update after purchase
def update_inventory_from_cart(inventory, cart):
    for item in cart.items.values():
        book = item["book"]
        quantity = item["quantity"]

        inventory_book = inventory.find_book_by_id(book.book_id)

        if inventory_book:
            inventory_book.quantity = max(0, inventory_book.quantity - quantity)


# Restock order for supplier if inventory is low
def generate_supplier_order(inventory):
    print("\nSUPPLIER RESTOCK ORDER")

    data = []

    for book in inventory.books:
        if book.quantity <= 2:
            reorder_amount = 5

            data.append([book.book_id, book.title, book.quantity, reorder_amount])

    if data:
        print(
            tabulate(
                data, headers=["Book ID", "Title", "Stock", "Reorder"], tablefmt="grid"
            )
        )
    else:
        print("No restock needed.")


# a Test to see if it works
inventory = Inventory()

inventory.add_book(Book(1, "The Great Gatsby", "F. Scott Fitzgerald", 10.99, 5))
inventory.add_book(Book(2, "1984", "George Orwell", 12.99, 3))

cart = Cart()

book1 = inventory.find_book_by_id(1)
book2 = inventory.find_book_by_id(2)

cart.add_item(book1, 3)
cart.add_item(book2, 2)


# Full process
generate_invoice(cart)
update_inventory_from_cart(inventory, cart)
generate_supplier_order(inventory)
