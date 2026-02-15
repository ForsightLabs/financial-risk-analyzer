import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'risk_monitor',  # Change to your database name
    'user': 'postgres',           # Change to your username
    'password': 'aryan29jun',  # Change to your password
    'port': '5432'
}

def create_connection():
    """Create database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Database connection successful!")
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def load_customers(conn, csv_path):
    """Load customers.csv into database"""
    print("\n📂 Loading customers data...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute("TRUNCATE customers CASCADE;")
    
    # Insert data
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO customers (
                user_id, name, email, phone, account_number,
                credit_score, credit_score_status, status,
                total_assets, total_liabilities, total_debt, net_worth,
                monthly_income, monthly_expenses, risk_score, risk_percentage,
                stress_level, date_joined, last_updated
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            row['user_id'], row['name'], row['email'], row['phone'],
            row['account_number'], row['credit_score'], row['credit_score_status'],
            row['status'], row['total_assets'], row['total_liabilities'],
            row['total_debt'], row['net_worth'], row['monthly_income'],
            row['monthly_expenses'], row['risk_score'], row['risk_percentage'],
            row['stress_level'], row['date_joined'], row['last_updated']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} customers")

def load_transactions(conn, csv_path):
    """Load transactions.csv into database"""
    print("\n📂 Loading transactions data...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM transactions;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO transactions (
                customer_user_id, transaction_date, description,
                amount, type, category
            ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['transaction_date'],
            row['description'], row['amount'], row['type'], row['category']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} transactions")

def load_cash_flow(conn, csv_path):
    """Load cash_flow_records.csv into database"""
    print("\n📂 Loading cash flow data...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM cash_flow_records;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO cash_flow_records (
                customer_user_id, month, year, total_income, total_expenses
            ) VALUES (%s, %s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['month'], row['year'],
            row['total_income'], row['total_expenses']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} cash flow records")

def load_credit_score_history(conn, csv_path):
    """Load credit_score_history.csv into database"""
    print("\n📂 Loading credit score history...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM credit_score_history;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO credit_score_history (
                customer_user_id, month, year, score
            ) VALUES (%s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['month'], row['year'], row['score']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} credit score records")

def load_payment_history(conn, csv_path):
    """Load payment_history.csv into database"""
    print("\n📂 Loading payment history...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM payment_history;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO payment_history (
                customer_user_id, month, year, on_time_percentage, late_percentage
            ) VALUES (%s, %s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['month'], row['year'],
            row['on_time_percentage'], row['late_percentage']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} payment history records")

def load_spending_categories(conn, csv_path):
    """Load spending_categories.csv into database"""
    print("\n📂 Loading spending categories...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM spending_categories;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO spending_categories (
                customer_user_id, category, percentage, amount, month
            ) VALUES (%s, %s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['category'], row['percentage'],
            row['amount'], row['month']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} spending category records")

def load_alerts(conn, csv_path):
    """Load alerts.csv into database"""
    print("\n📂 Loading alerts...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM alerts;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO alerts (
                customer_user_id, type, message, created_at
            ) VALUES (%s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['type'], row['message'], row['created_at']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} alerts")

def load_liquidity_data(conn, csv_path):
    """Load liquidity_data.csv into database"""
    print("\n📂 Loading liquidity data...")
    
    df = pd.read_csv(csv_path)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM liquidity_data;")
    
    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO liquidity_data (
                customer_user_id, month, year, amount
            ) VALUES (%s, %s, %s, %s)
        """, (
            row['customer_user_id'], row['month'], row['year'], row['amount']
        ))
    
    conn.commit()
    print(f"✅ Loaded {len(df)} liquidity records")

def main():
    """Main function to load all CSV files"""
    print("🚀 Starting data import process...\n")
    
    # Connect to database
    conn = create_connection()
    if not conn:
        return
    
    try:
        # Base path for CSV files
        base_path = "data/"
        
        # Load all CSV files
        load_customers(conn, f"{base_path}customers.csv")
        load_transactions(conn, f"{base_path}transactions.csv")
        load_cash_flow(conn, f"{base_path}cash_flow_records.csv")
        load_credit_score_history(conn, f"{base_path}credit_score_history.csv")
        load_payment_history(conn, f"{base_path}payment_history.csv")
        load_spending_categories(conn, f"{base_path}spending_categories.csv")
        load_alerts(conn, f"{base_path}alerts.csv")
        load_liquidity_data(conn, f"{base_path}liquidity_data.csv")
        
        print("\n✅ All data loaded successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during import: {e}")
        conn.rollback()
    finally:
        conn.close()
        print("\n🔒 Database connection closed")

if __name__ == "__main__":
    main()