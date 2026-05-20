# -----------------------------------------------------------
# Date: May 13, 2026
# Course: Bookstore Management System
# Description:
# This program creates a simple bookstore management system.
# Users can browse books, add books to a cart, view the cart,
# process a sale, and update inventory after purchase.
# -----------------------------------------------------------


class Book:
    def __init__(self, book_id, title, author, price, quantity):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.price = price
        self.quantity = quantity

    def display_book(self):
        print(f"ID: {self.book_id}")
        print(f"Title: {self.title}")
        print(f"Author: {self.author}")
        print(f"Price: ${self.price:.2f}")
        print(f"Available Quantity: {self.quantity}")
        print("-" * 35)


class Inventory:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)

    def display_available_books(self):
        print("\nAvailable Books")
        print("=" * 35)

        available_found = False

        for book in self.books:
            if book.quantity > 0:
                book.display_book()
                available_found = True

        if not available_found:
            print("No books are currently available.")

    def find_book_by_id(self, book_id):
        for book in self.books:
            if book.book_id == book_id:
                return book
        return None

    def update_quantity(self, book, quantity_sold):
        book.quantity -= quantity_sold


class Cart:
    def __init__(self):
        self.items = {}

    def add_item(self, book, quantity):
        if quantity <= 0:
            print("Quantity must be greater than zero.")
            return

        if quantity > book.quantity:
            print("Not enough inventory available.")
            return

        if book.book_id in self.items:
            current_quantity = self.items[book.book_id]["quantity"]

            if current_quantity + quantity > book.quantity:
                print("Cannot add that many. Not enough inventory available.")
                return

            self.items[book.book_id]["quantity"] += quantity
        else:
            self.items[book.book_id] = {"book": book, "quantity": quantity}

        print(f"Added {quantity} copy/copies of '{book.title}' to the cart.")

    def remove_item(self, book_id):
        if book_id in self.items:
            removed_book = self.items[book_id]["book"]
            del self.items[book_id]
            print(f"Removed '{removed_book.title}' from the cart.")
        else:
            print("That book is not in the cart.")

    def view_cart(self):
        print("\nShopping Cart")
        print("=" * 35)

        if not self.items:
            print("Your cart is empty.")
            return

        for item in self.items.values():
            book = item["book"]
            quantity = item["quantity"]
            subtotal = book.price * quantity

            print(f"Title: {book.title}")
            print(f"Quantity: {quantity}")
            print(f"Price Each: ${book.price:.2f}")
            print(f"Subtotal: ${subtotal:.2f}")
            print("-" * 35)

        print(f"Total: ${self.calculate_total():.2f}")

    def calculate_total(self):
        total = 0

        for item in self.items.values():
            book = item["book"]
            quantity = item["quantity"]
            total += book.price * quantity

        return total

    def clear_cart(self):
        self.items.clear()


class Sale:
    def __init__(self, cart, inventory):
        self.cart = cart
        self.inventory = inventory

    def process_sale(self):
        if not self.cart.items:
            print("Cannot process sale. The cart is empty.")
            return

        print("\nProcessing Sale...")
        print("=" * 35)

        for item in self.cart.items.values():
            book = item["book"]
            quantity = item["quantity"]

            if quantity > book.quantity:
                print(f"Sale failed. Not enough stock for '{book.title}'.")
                return

        for item in self.cart.items.values():
            book = item["book"]
            quantity = item["quantity"]
            self.inventory.update_quantity(book, quantity)

        self.generate_receipt()
        self.cart.clear_cart()

        print("Sale completed successfully.")
        print("Inventory has been updated.")

    def generate_receipt(self):
        print("\nReceipt")
        print("=" * 35)

        for item in self.cart.items.values():
            book = item["book"]
            quantity = item["quantity"]
            subtotal = book.price * quantity

            print(f"{book.title} x {quantity} = ${subtotal:.2f}")

        print("-" * 35)
        print(f"Total Paid: ${self.cart.calculate_total():.2f}")


def display_menu():
    print("\nBookstore Management System")
    print("=" * 35)
    print("1. Browse available books")
    print("2. Add book to cart")
    print("3. View cart")
    print("4. Remove book from cart")
    print("5. Process sale")
    print("6. View updated inventory")
    print("7. Exit")


def main():
    inventory = Inventory()
    cart = Cart()

    inventory.add_book(Book(1, "The Great Gatsby", "F. Scott Fitzgerald", 10.99, 5))
    inventory.add_book(Book(2, "1984", "George Orwell", 12.99, 3))
    inventory.add_book(Book(3, "To Kill a Mockingbird", "Harper Lee", 9.99, 0))
    inventory.add_book(Book(4, "The Hobbit", "J.R.R. Tolkien", 14.99, 2))
    inventory.add_book(Book(5, "Moby Dick", "Herman Melville", 11.50, 4))

    while True:
        display_menu()

        choice = input("\nEnter your choice: ")

        if choice == "1":
            inventory.display_available_books()

        elif choice == "2":
            inventory.display_available_books()

            try:
                book_id = int(input("Enter the book ID to add: "))
                quantity = int(input("Enter quantity: "))

                selected_book = inventory.find_book_by_id(book_id)

                if selected_book is None:
                    print("Book not found.")
                elif selected_book.quantity == 0:
                    print("This book is out of stock.")
                else:
                    cart.add_item(selected_book, quantity)

            except ValueError:
                print("Please enter a valid number.")

        elif choice == "3":
            cart.view_cart()

        elif choice == "4":
            try:
                book_id = int(input("Enter the book ID to remove from cart: "))
                cart.remove_item(book_id)
            except ValueError:
                print("Please enter a valid book ID.")

        elif choice == "5":
            sale = Sale(cart, inventory)
            sale.process_sale()

        elif choice == "6":
            inventory.display_available_books()

        elif choice == "7":
            print("Thank you for using the bookstore system.")
            break

        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
