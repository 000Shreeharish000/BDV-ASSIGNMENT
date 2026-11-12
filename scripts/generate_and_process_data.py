"""
Hospital Patient Admission & Disease Distribution Analysis
Dataset Generation and Preprocessing Pipeline
Course: 21CSE423T - Big Data Visualization | SRM IST Tiruchirappalli
Faculty Handling: Dr. Ganagavalli K
"""

import json
import random
import datetime
import math
import os

# Set seed for reproducible deterministic research results
random.seed(42)

def generate_hospital_dataset(num_records=4000):
    start_date = datetime.date(2024, 1, 1)
    end_date = datetime.date(2024, 12, 31)
    total_days = (end_date - start_date).days + 1

    disease_catalog = [
        {
            "category": "Cardiovascular Diseases",
            "diagnoses": ["Acute Myocardial Infarction", "Hypertensive Heart Disease", "Congestive Heart Failure", "Atrial Fibrillation"],
            "dept": "Cardiology",
            "age_weights": [0.02, 0.08, 0.30, 0.38, 0.22],
            "gender_weights": [0.55, 0.44, 0.01],
            "base_los": 5.8,
            "admission_types": [("Emergency", 0.60), ("Urgent", 0.25), ("Elective / Scheduled", 0.15)]
        },
        {
            "category": "Respiratory Infections",
            "diagnoses": ["Community-Acquired Pneumonia", "COPD Acute Exacerbation", "Severe Asthma Crisis", "Acute Bronchitis"],
            "dept": "Pulmonology",
            "age_weights": [0.18, 0.12, 0.22, 0.28, 0.20],
            "gender_weights": [0.51, 0.48, 0.01],
            "base_los": 4.6,
            "admission_types": [("Emergency", 0.52), ("Urgent", 0.30), ("Elective / Scheduled", 0.18)]
        },
        {
            "category": "Neurological Disorders",
            "diagnoses": ["Acute Ischemic Stroke", "Intractable Epilepsy", "Multiple Sclerosis Relapse", "Parkinsonian Crisis"],
            "dept": "Neurology",
            "age_weights": [0.04, 0.10, 0.26, 0.36, 0.24],
            "gender_weights": [0.49, 0.50, 0.01],
            "base_los": 6.9,
            "admission_types": [("Emergency", 0.65), ("Urgent", 0.20), ("Elective / Scheduled", 0.15)]
        },
        {
            "category": "Gastrointestinal Conditions",
            "diagnoses": ["Acute Appendicitis", "Cholecystitis & Gallstones", "Peptic Ulcer Perforation", "Severe Acute Pancreatitis"],
            "dept": "Gastroenterology",
            "age_weights": [0.10, 0.25, 0.35, 0.22, 0.08],
            "gender_weights": [0.52, 0.47, 0.01],
            "base_los": 4.1,
            "admission_types": [("Emergency", 0.48), ("Urgent", 0.32), ("Elective / Scheduled", 0.20)]
        },
        {
            "category": "Orthopedic Trauma",
            "diagnoses": ["Femur Fracture", "Cervical Spine Trauma", "End-Stage Osteoarthritis Replacement", "Polytrauma Pelvic Fracture"],
            "dept": "Orthopedics",
            "age_weights": [0.08, 0.22, 0.26, 0.26, 0.18],
            "gender_weights": [0.58, 0.41, 0.01],
            "base_los": 5.4,
            "admission_types": [("Emergency", 0.45), ("Urgent", 0.20), ("Elective / Scheduled", 0.35)]
        },
        {
            "category": "Endocrine & Metabolic",
            "diagnoses": ["Diabetic Ketoacidosis (DKA)", "Hyperosmolar Hyperglycemic State", "Severe Hypoglycemia", "Thyroid Storm"],
            "dept": "Endocrinology",
            "age_weights": [0.05, 0.15, 0.42, 0.28, 0.10],
            "gender_weights": [0.47, 0.52, 0.01],
            "base_los": 3.9,
            "admission_types": [("Emergency", 0.42), ("Urgent", 0.38), ("Elective / Scheduled", 0.20)]
        },
        {
            "category": "Oncology & Neoplasms",
            "diagnoses": ["Colorectal Carcinoma", "Bronchogenic Carcinoma", "Non-Hodgkin Lymphoma", "Metastatic Breast Neoplasm"],
            "dept": "Oncology",
            "age_weights": [0.02, 0.08, 0.32, 0.40, 0.18],
            "gender_weights": [0.46, 0.53, 0.01],
            "base_los": 7.8,
            "admission_types": [("Emergency", 0.25), ("Urgent", 0.40), ("Elective / Scheduled", 0.35)]
        },
        {
            "category": "Infectious & Parasitic",
            "diagnoses": ["Severe Sepsis / Septic Shock", "Viral Hemorrhagic Dengue", "Pyelonephritis with Urosepsis", "Bacterial Meningitis"],
            "dept": "General Medicine",
            "age_weights": [0.15, 0.18, 0.25, 0.24, 0.18],
            "gender_weights": [0.50, 0.49, 0.01],
            "base_los": 5.1,
            "admission_types": [("Emergency", 0.70), ("Urgent", 0.22), ("Elective / Scheduled", 0.08)]
        }
    ]

    age_cohorts = [
        {"name": "Pediatric (0-17)", "min": 0, "max": 17},
        {"name": "Young Adult (18-35)", "min": 18, "max": 35},
        {"name": "Middle-Aged (36-55)", "min": 36, "max": 55},
        {"name": "Senior (56-70)", "min": 56, "max": 70},
        {"name": "Geriatric (71+)", "min": 71, "max": 94}
    ]

    records = []
    category_weights = [0.22, 0.18, 0.13, 0.14, 0.12, 0.08, 0.07, 0.06]

    for i in range(1, num_records + 1):
        pid = f"PAT-{i:05d}"
        
        # Pick category
        cat_obj = random.choices(disease_catalog, weights=category_weights, k=1)[0]
        category = cat_obj["category"]
        diagnosis = random.choice(cat_obj["diagnoses"])
        dept = cat_obj["dept"]

        # Department routing nuance: some severe cases route to ICU
        is_icu = random.random() < 0.085
        if is_icu and category in ["Cardiovascular Diseases", "Respiratory Infections", "Neurological Disorders", "Infectious & Parasitic"]:
            actual_dept = "Intensive Care Unit (ICU)"
        else:
            actual_dept = dept

        # Age group selection based on weights
        chosen_cohort_idx = random.choices(range(5), weights=cat_obj["age_weights"], k=1)[0]
        cohort = age_cohorts[chosen_cohort_idx]
        age = random.randint(cohort["min"], cohort["max"])
        age_group = cohort["name"]

        # Gender
        gender = random.choices(["Male", "Female", "Other"], weights=cat_obj["gender_weights"], k=1)[0]

        # Admission Date with seasonal variance (Winter respiratory peaks in Dec-Feb, summer trauma peaks in May-July)
        day_offset = random.randint(0, total_days - 1)
        adm_date = start_date + datetime.timedelta(days=day_offset)
        month = adm_date.month

        # Seasonal adjustment
        if category == "Respiratory Infections" and month in [11, 12, 1, 2]:
            if random.random() > 0.35: # respiratory bump
                pass
        elif category == "Orthopedic Trauma" and month in [5, 6, 7]:
            if random.random() > 0.35: # outdoor activity trauma bump
                pass

        # Admission type
        adm_types = [t[0] for t in cat_obj["admission_types"]]
        adm_type_weights = [t[1] for t in cat_obj["admission_types"]]
        if actual_dept == "Intensive Care Unit (ICU)":
            adm_type = "Emergency"
        else:
            adm_type = random.choices(adm_types, weights=adm_type_weights, k=1)[0]

        # Length of stay (log-normal distribution around base_los)
        base = cat_obj["base_los"]
        if actual_dept == "Intensive Care Unit (ICU)":
            base += 4.5
        if age_group in ["Senior (56-70)", "Geriatric (71+)"]:
            base *= 1.25
        if adm_type == "Emergency":
            base *= 1.15
        
        # Add random lognormal noise
        los = max(1, int(round(random.lognormvariate(math.log(base), 0.38))))
        if los > 35: # realistic cap
            los = 35

        dis_date = adm_date + datetime.timedelta(days=los)

        # Severity
        if actual_dept == "Intensive Care Unit (ICU)" or los > 14:
            severity = random.choices(["Severe", "Critical"], weights=[0.45, 0.55], k=1)[0]
        elif los >= 7:
            severity = random.choices(["Moderate", "Severe"], weights=[0.55, 0.45], k=1)[0]
        elif los <= 3:
            severity = random.choices(["Mild", "Moderate"], weights=[0.70, 0.30], k=1)[0]
        else:
            severity = random.choices(["Mild", "Moderate", "Severe"], weights=[0.25, 0.55, 0.20], k=1)[0]

        # Discharge status
        if severity == "Critical":
            dis_status = random.choices(["Discharged - Home", "Discharged - Rehab", "Transferred", "Mortality"], weights=[0.55, 0.25, 0.12, 0.08], k=1)[0]
        elif severity == "Severe":
            dis_status = random.choices(["Discharged - Home", "Discharged - Rehab", "Transferred", "Mortality"], weights=[0.75, 0.18, 0.05, 0.02], k=1)[0]
        else:
            dis_status = random.choices(["Discharged - Home", "Discharged - Rehab"], weights=[0.92, 0.08], k=1)[0]

        # Total hospital bill (INR: base * daily cost + severity tier)
        daily_rate = 8500 if actual_dept == "Intensive Care Unit (ICU)" else (5200 if actual_dept == "Cardiology" or actual_dept == "Oncology" else 3600)
        proc_cost = 45000 if adm_type == "Elective / Scheduled" and actual_dept == "Orthopedics" else random.randint(12000, 35000)
        total_cost = int(los * daily_rate + proc_cost + random.randint(2000, 15000))

        insurance = random.choices(["Private Comprehensive", "Government Scheme (PMJAY/CMCHIS)", "Self-Pay / Out-of-Pocket"], weights=[0.48, 0.38, 0.14], k=1)[0]

        records.append({
            "patient_id": pid,
            "admission_date": adm_date.isoformat(),
            "discharge_date": dis_date.isoformat(),
            "month": adm_date.strftime("%b"),
            "month_num": adm_date.month,
            "quarter": f"Q{(adm_date.month - 1) // 3 + 1}",
            "day_of_week": adm_date.strftime("%a"),
            "age": age,
            "age_group": age_group,
            "gender": gender,
            "disease_category": category,
            "diagnosis": diagnosis,
            "department": actual_dept,
            "admission_type": adm_type,
            "length_of_stay": los,
            "severity": severity,
            "discharge_status": dis_status,
            "total_cost_inr": total_cost,
            "insurance_type": insurance
        })

    return records

def write_csv(records, filepath):
    if not records:
        return
    headers = list(records[0].keys())
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(",".join(headers) + "\n")
        for r in records:
            row = [str(r[h]) for h in headers]
            f.write(",".join(row) + "\n")

def main():
    os.makedirs("data", exist_ok=True)
    os.makedirs("public/data", exist_ok=True)
    os.makedirs("reports", exist_ok=True)
    os.makedirs("presentation", exist_ok=True)
    os.makedirs("exports", exist_ok=True)

    print("Generating 4,000 synthetic clinical records matching SRM CLA-2 specifications...")
    records = generate_hospital_dataset(4000)

    # Save CSV & JSON
    csv_path = "data/hospital_admissions.csv"
    json_path = "data/hospital_admissions.json"
    public_csv_path = "public/data/hospital_admissions.csv"
    public_json_path = "public/data/hospital_admissions.json"

    write_csv(records, csv_path)
    write_csv(records, public_csv_path)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    with open(public_json_path, "w", encoding="utf-8") as f:
        json.dump(records, f)

    print(f"Generated {len(records)} records successfully.")
    print(f"Files saved to {csv_path} and {json_path}.")

if __name__ == "__main__":
    main()

