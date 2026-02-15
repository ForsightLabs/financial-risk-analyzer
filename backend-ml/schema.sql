-- Drop existing tables
DROP TABLE IF EXISTS liquidity_data CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS spending_categories CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS credit_score_history CASCADE;
DROP TABLE IF EXISTS cash_flow_records CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create customers table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    account_number VARCHAR(100),
    credit_score INTEGER,
    credit_score_status VARCHAR(50),
    status VARCHAR(50),
    total_assets DECIMAL(15,2),
    total_liabilities DECIMAL(15,2),
    total_debt DECIMAL(15,2),
    net_worth DECIMAL(15,2),
    monthly_income DECIMAL(15,2),
    monthly_expenses DECIMAL(15,2),
    risk_score VARCHAR(20),
    risk_percentage INTEGER,
    stress_level VARCHAR(50),
    date_joined DATE,
    last_updated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    transaction_date DATE,
    description VARCHAR(500),
    amount DECIMAL(15,2),
    type VARCHAR(20),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cash_flow_records table
CREATE TABLE cash_flow_records (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    month VARCHAR(20),
    year INTEGER,
    total_income DECIMAL(15,2),
    total_expenses DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create credit_score_history table
CREATE TABLE credit_score_history (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    month VARCHAR(20),
    year INTEGER,
    score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_history table
CREATE TABLE payment_history (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    month VARCHAR(20),
    year INTEGER,
    on_time_percentage INTEGER,
    late_percentage INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spending_categories table
CREATE TABLE spending_categories (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    category VARCHAR(100),
    percentage INTEGER,
    amount DECIMAL(15,2),
    month VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    type VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP
);

-- Create liquidity_data table
CREATE TABLE liquidity_data (
    id BIGSERIAL PRIMARY KEY,
    customer_user_id VARCHAR(50) REFERENCES customers(user_id),
    month VARCHAR(20),
    year INTEGER,
    amount DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_customer ON transactions(customer_user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_cash_flow_customer ON cash_flow_records(customer_user_id);
CREATE INDEX idx_credit_history_customer ON credit_score_history(customer_user_id);
CREATE INDEX idx_payment_history_customer ON payment_history(customer_user_id);
CREATE INDEX idx_spending_customer ON spending_categories(customer_user_id);
CREATE INDEX idx_alerts_customer ON alerts(customer_user_id);
CREATE INDEX idx_liquidity_customer ON liquidity_data(customer_user_id);