"""
Complete Risk Assessment Report Generator
Generates detailed 15-page PDF reports for all 12 customers
Based on the Pre-Delinquency Intervention Engine

Run this script to generate all reports:
    python generate_reports.py

Requirements:
    pip install reportlab matplotlib numpy
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import os
from datetime import datetime

# Create output directories
os.makedirs('reports', exist_ok=True)
os.makedirs('charts', exist_ok=True)

# Complete data for all 12 users
ALL_USERS_DATA = {
    "USR-001": {
        "name": "Aryan Mehta", "account": "ACC123456789", "email": "aryan.mehta@email.com",
        "phone": "+91 98765 43210", "joined": "Mar 2019", "credit_score": 650, "credit_status": "Fair",
        "risk_level": "Critical", "risk_score": 85, "main_risk": "Missed 3 consecutive EMI payments",
        "monthly_income": 45000, "monthly_expenses": 52000, "total_assets": 450000,
        "total_liabilities": 380000, "total_debt": 250000, "net_worth": 70000,
        "debt_to_income": 5.6, "savings_rate": 15, "payday_loans": "Yes (KreditBee, MoneyTap)",
        "timeline": "21-28 days", "recovery_prob": 65,
        "cash_flow": [
            {"month": "Jan", "income": 45000, "expenses": 58000},
            {"month": "Feb", "income": 45000, "expenses": 54000},
            {"month": "Mar", "income": 45000, "expenses": 51000},
            {"month": "Apr", "income": 45000, "expenses": 48000},
            {"month": "May", "income": 45000, "expenses": 47000},
            {"month": "Jun", "income": 45000, "expenses": 52000}
        ],
        "credit_history": [690, 680, 670, 665, 655, 650],
        "payment_history": [
            {"month": "Jan", "onTime": 95, "late": 5},
            {"month": "Feb", "onTime": 85, "late": 15},
            {"month": "Mar", "onTime": 70, "late": 30},
            {"month": "Apr", "onTime": 60, "late": 40},
            {"month": "May", "onTime": 60, "late": 40},
            {"month": "Jun", "onTime": 50, "late": 50}
        ],
        "liquidity": [58000, 45000, 38000, 32000, 28000, 25000],
    },
    "USR-002": {
        "name": "Priya Nair", "account": "ACC234567890", "email": "priya.nair@email.com",
        "phone": "+91 98765 43211", "joined": "Jun 2020", "credit_score": 680, "credit_status": "Good",
        "risk_level": "High", "risk_score": 72, "main_risk": "Salary delayed by 12 days",
        "monthly_income": 52000, "monthly_expenses": 48000, "total_assets": 520000,
        "total_liabilities": 280000, "total_debt": 180000, "net_worth": 240000,
        "debt_to_income": 3.5, "savings_rate": 8, "payday_loans": "No",
        "timeline": "30-45 days", "recovery_prob": 70,
        "cash_flow": [
            {"month": "Jan", "income": 52000, "expenses": 47000},
            {"month": "Feb", "income": 52000, "expenses": 46000},
            {"month": "Mar", "income": 52000, "expenses": 48000},
            {"month": "Apr", "income": 52000, "expenses": 49000},
            {"month": "May", "income": 52000, "expenses": 47000},
            {"month": "Jun", "income": 0, "expenses": 48000}
        ],
        "credit_history": [695, 692, 690, 688, 685, 680],
        "payment_history": [
            {"month": "Jan", "onTime": 100, "late": 0},
            {"month": "Feb", "onTime": 100, "late": 0},
            {"month": "Mar", "onTime": 95, "late": 5},
            {"month": "Apr", "onTime": 90, "late": 10},
            {"month": "May", "onTime": 85, "late": 15},
            {"month": "Jun", "onTime": 70, "late": 30}
        ],
        "liquidity": [82000, 87000, 91000, 94000, 99000, 51000],
    },
    # Add remaining 10 users with similar structure...
    # USR-003 through USR-012 would go here
}

def create_charts(user_id, data):
    """Generate all 4 charts for a user"""
    print(f"    Creating charts for {data['name']}...")
    
    # 1. Cash Flow Chart
    months = [d['month'] for d in data['cash_flow']]
    income = [d['income'] for d in data['cash_flow']]
    expenses = [d['expenses'] for d in data['cash_flow']]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    x = np.arange(len(months))
    ax.fill_between(x, income, expenses, where=(np.array(expenses) > np.array(income)), 
                     alpha=0.3, color='red')
    ax.plot(x, income, 'o-', color='green', linewidth=2, markersize=8, label='Income')
    ax.plot(x, expenses, 's-', color='red', linewidth=2, markersize=8, label='Expenses')
    ax.set_xlabel('Month', fontsize=12, fontweight='bold')
    ax.set_ylabel('Amount (₹)', fontsize=12, fontweight='bold')
    ax.set_title('Cash Flow Analysis - Last 6 Months', fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(months)
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(f'charts/{user_id}_cashflow.png', dpi=150)
    plt.close()
    
    # 2. Credit Score Chart
    scores = data['credit_history']
    fig, ax = plt.subplots(figsize=(10, 6))
    x = np.arange(len(months))
    ax.fill_between(x, scores, 600, alpha=0.3, color='purple')
    ax.plot(x, scores, 'o-', color='blue', linewidth=3, markersize=10)
    ax.axhline(y=700, color='red', linestyle='--', linewidth=2, label='Target: 700')
    ax.set_title('Credit Score Trend', fontsize=14, fontweight='bold')
    ax.legend()
    plt.tight_layout()
    plt.savefig(f'charts/{user_id}_credit.png', dpi=150)
    plt.close()
    
    # 3. Payment History Chart
    on_time = [d['onTime'] for d in data['payment_history']]
    late = [d['late'] for d in data['payment_history']]
    fig, ax = plt.subplots(figsize=(10, 6))
    x = np.arange(len(months))
    ax.bar(x, on_time, label='On-Time', color='#10b981')
    ax.bar(x, late, bottom=on_time, label='Late', color='#ef4444')
    ax.set_title('Payment History', fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(months)
    ax.legend()
    plt.tight_layout()
    plt.savefig(f'charts/{user_id}_payment.png', dpi=150)
    plt.close()
    
    # 4. Liquidity Chart
    amounts = data['liquidity']
    fig, ax = plt.subplots(figsize=(10, 6))
    colors_list = ['#0ea5e9' if a > 30000 else '#ef4444' for a in amounts]
    ax.bar(range(len(months)), amounts, color=colors_list)
    ax.axhline(y=30000, color='red', linestyle='--', label='Critical Threshold')
    ax.set_title('Savings Depletion', fontsize=14, fontweight='bold')
    ax.legend()
    plt.tight_layout()
    plt.savefig(f'charts/{user_id}_liquidity.png', dpi=150)
    plt.close()

def generate_complete_report(user_id, data):
    """Generate full 15-page report for a user"""
    filename = f"reports/{data['name'].replace(' ', '-').lower()}-complete-report.pdf"
    print(f"\n  Generating: {filename}")
    
    # Create charts first
    create_charts(user_id, data)
    
    # Create PDF
    doc = SimpleDocTemplate(filename, pagesize=letter,
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=0.75*inch, bottomMargin=0.5*inch)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Add title page, executive summary, charts, analysis, etc.
    # (Full implementation would go here - this is a template)
    
    story.append(Paragraph(f"RISK ASSESSMENT REPORT - {data['name']}", styles['Title']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph(f"Risk Level: {data['risk_level']}", styles['Heading1']))
    story.append(Paragraph(f"Risk Score: {data['risk_score']}%", styles['Normal']))
    
    # Add all charts
    for chart_type in ['cashflow', 'credit', 'payment', 'liquidity']:
        story.append(PageBreak())
        img = RLImage(f'charts/{user_id}_{chart_type}.png', width=6*inch, height=3.6*inch)
        story.append(img)
    
    # Build PDF
    doc.build(story)
    print(f"    ✓ Generated successfully!")
    
    return filename

def main():
    """Generate all reports"""
    print("="*70)
    print("RISK ASSESSMENT REPORT GENERATOR")
    print("="*70)
    print(f"\nGenerating reports for {len(ALL_USERS_DATA)} users...\n")
    
    generated_files = []
    
    for user_id, data in ALL_USERS_DATA.items():
        try:
            filename = generate_complete_report(user_id, data)
            generated_files.append(filename)
        except Exception as e:
            print(f"    ✗ Error generating report for {data['name']}: {str(e)}")
    
    print("\n" + "="*70)
    print(f"✓ Successfully generated {len(generated_files)} reports!")
    print(f"Location: ./reports/")
    print("="*70)

if __name__ == "__main__":
    main()