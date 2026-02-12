// Curated insurance knowledge base for RAG retrieval
// Each chunk: { id, topic, category, content } (200-500 words)

export const KNOWLEDGE_BASE = [
  // ── Terminology / Glossary ─────────────────────────────────

  {
    id: "term_001",
    topic: "Insurance Premium",
    category: "terminology",
    content:
      "An insurance premium is the amount of money an individual or business pays to an insurance company in exchange for coverage. Premiums can be paid monthly, quarterly, half-yearly, or annually depending on the policy terms. The premium amount is determined by several factors including the insured's age, health condition, occupation, lifestyle habits (like smoking), the type and amount of coverage, and the policy term. In life insurance, premiums are generally higher for older individuals and those with pre-existing health conditions. For motor insurance, premiums depend on the vehicle's make, model, age, and the insured's driving history. Paying premiums on time is essential to keep the policy active. If premiums are not paid within the grace period, the policy may lapse, meaning the coverage ceases. Some policies offer premium waiver riders, which waive future premiums if the policyholder becomes critically ill or disabled.",
  },
  {
    id: "term_002",
    topic: "Sum Insured / Sum Assured",
    category: "terminology",
    content:
      "Sum insured (used in general insurance) and sum assured (used in life insurance) refer to the maximum amount an insurance company will pay in the event of a claim. In health insurance, the sum insured is the maximum amount the insurer will cover for hospitalization expenses in a policy year. In life insurance, the sum assured is the guaranteed amount paid to the nominee upon the policyholder's death. Choosing an adequate sum insured is crucial — too low and you risk being underinsured, too high and you pay unnecessarily high premiums. A common guideline for life insurance is to have coverage of 10-15 times your annual income. For health insurance, factors like age, city of residence, family medical history, and inflation in medical costs should guide your choice. Some health policies offer features like 'restore benefit' which reinstates the sum insured if it gets exhausted during the policy year.",
  },
  {
    id: "term_003",
    topic: "Deductible in Insurance",
    category: "terminology",
    content:
      "A deductible is the amount you must pay out of your own pocket before the insurance company starts paying for a claim. For example, if your health insurance policy has a deductible of Rs 10,000 and your hospital bill is Rs 50,000, you pay the first Rs 10,000 and the insurer pays the remaining Rs 40,000. Deductibles help keep premiums lower because the insured shares some of the financial risk. There are two main types: compulsory deductibles (set by the insurer and cannot be changed) and voluntary deductibles (chosen by the policyholder in exchange for a lower premium). Higher deductibles result in lower premiums but more out-of-pocket costs at claim time. In motor insurance, a compulsory deductible is mandated by the IRDAI. Deductibles are different from co-payments — a deductible is a fixed amount while a co-payment is typically a percentage of the claim.",
  },
  {
    id: "term_004",
    topic: "Co-payment (Co-pay)",
    category: "terminology",
    content:
      "A co-payment or co-pay is a cost-sharing mechanism where the policyholder pays a fixed percentage of the claim amount, and the insurer pays the rest. For instance, if your policy has a 20% co-pay and the total hospital bill is Rs 1,00,000, you pay Rs 20,000 and the insurer pays Rs 80,000. Co-pay clauses are commonly found in health insurance policies, especially for senior citizen plans or policies covering pre-existing diseases. The co-pay percentage can vary — some policies have 10%, 20%, or even 30% co-pay. Policies with higher co-pay percentages generally have lower premiums. It is important to carefully check the co-pay clause before buying a policy, as it directly affects your out-of-pocket expenses during a claim. Some insurers apply co-pay only when treatment is taken in non-network hospitals or in specific cities.",
  },
  {
    id: "term_005",
    topic: "Waiting Period in Insurance",
    category: "terminology",
    content:
      "A waiting period is a specific duration after purchasing a policy during which certain benefits are not available. In health insurance, there are typically three types of waiting periods: (1) Initial waiting period — usually 30 days from the policy start date, during which no claims are accepted except for accidental hospitalization. (2) Pre-existing disease waiting period — typically 2-4 years, during which illnesses you already had before buying the policy are not covered. (3) Specific disease waiting period — usually 1-2 years, for certain listed conditions like hernia, cataract, joint replacement, etc. Waiting periods protect insurers from people who buy insurance only when they know they need immediate treatment. When comparing health insurance plans, always check the waiting period clauses — shorter waiting periods are generally better for the policyholder. Some insurers offer the option to reduce waiting periods by paying a higher premium.",
  },
  {
    id: "term_006",
    topic: "Policy Exclusions",
    category: "terminology",
    content:
      "Exclusions are specific conditions, situations, or circumstances that are not covered by an insurance policy. Every insurance policy has a list of exclusions clearly mentioned in the policy document. Common exclusions in health insurance include cosmetic or aesthetic treatments, self-inflicted injuries, injuries due to substance abuse, experimental treatments, and war or nuclear events. In life insurance, common exclusions include death by suicide within the first year. In motor insurance, damage due to driving under the influence of alcohol, driving without a valid license, or normal wear and tear are excluded. Understanding exclusions is critical before purchasing a policy, as claims arising from excluded situations will be denied. Permanent exclusions can never be claimed, while temporary exclusions (like waiting periods) become claimable after a specified period.",
  },
  {
    id: "term_007",
    topic: "Insurance Rider",
    category: "terminology",
    content:
      "A rider is an add-on benefit that can be attached to a base insurance policy for additional coverage by paying an extra premium. Riders provide enhanced protection without needing to buy a separate policy. Common life insurance riders include: Critical Illness Rider (pays a lump sum on diagnosis of specified critical illnesses), Accidental Death Benefit Rider (additional payout if death is due to an accident), Waiver of Premium Rider (waives future premiums if the policyholder becomes disabled or critically ill), and Income Benefit Rider (provides regular income to the family after the policyholder's death). In health insurance, common riders include hospital cash, personal accident cover, and outpatient treatment. The IRDAI mandates that the total rider premium should not exceed 30% of the base policy premium. While riders offer good value, it is important to evaluate whether you actually need them based on your specific situation.",
  },
  {
    id: "term_008",
    topic: "Nominee and Beneficiary",
    category: "terminology",
    content:
      "A nominee is the person designated by the policyholder to receive the insurance benefits in case of the policyholder's death. In India, the nominee acts as a trustee of the insurance proceeds, not necessarily the legal heir. This means the nominee receives the money on behalf of the legal heirs. The legal heirs can claim the money from the nominee if there is a dispute. It is important to keep nominee details updated, especially after major life events like marriage, birth of a child, or divorce. Multiple nominees can be appointed with specified percentage shares. A beneficiary, on the other hand, is the person who ultimately benefits from the policy proceeds. In many cases, the nominee and beneficiary are the same person. Under Section 39 of the Insurance Act, 1938, the policyholder can change the nominee at any time during the policy term by informing the insurance company in writing.",
  },
  {
    id: "term_009",
    topic: "Underwriting in Insurance",
    category: "terminology",
    content:
      "Underwriting is the process by which an insurance company evaluates the risk of insuring a person or asset and determines the premium to charge. An underwriter assesses factors like age, health history, occupation, lifestyle habits, and financial status to decide whether to accept, reject, or modify the terms of an insurance application. In life insurance, underwriting may involve medical examinations, blood tests, and reviewing medical history. In health insurance, disclosure of pre-existing conditions is critical during underwriting. In motor insurance, the vehicle's age, type, and usage pattern are assessed. There are different types of underwriting: medical underwriting (based on health), financial underwriting (based on income and assets), and occupational underwriting (based on job risk). Providing false or incomplete information during underwriting can lead to claim rejection later. Some policies offer simplified or guaranteed issue underwriting with no medical tests, but these usually come with higher premiums or lower coverage.",
  },
  {
    id: "term_010",
    topic: "Surrender Value and Paid-up Value",
    category: "terminology",
    content:
      "Surrender value is the amount a policyholder receives if they decide to terminate a life insurance policy before its maturity date. Not all policies have a surrender value — term insurance plans, being pure protection plans, do not accumulate any surrender value. Traditional plans like endowment and whole life policies acquire a surrender value after a minimum premium payment period, usually 2-3 years. The surrender value is typically lower than the total premiums paid, especially in the early years. There are two types: Guaranteed Surrender Value (a percentage of total premiums paid, excluding first year premium and rider premiums) and Special Surrender Value (calculated based on the policy's accrued bonuses and market conditions). A paid-up policy is one where the policyholder stops paying premiums but does not surrender the policy. The coverage continues at a reduced sum assured proportional to the premiums already paid. This is often a better option than surrendering if you cannot continue paying premiums.",
  },
  {
    id: "term_011",
    topic: "Grace Period in Insurance",
    category: "terminology",
    content:
      "A grace period is the additional time allowed by the insurer to pay the premium after the due date without the policy lapsing. In India, the IRDAI mandates a grace period of 15 days for monthly premium policies and 30 days for quarterly, half-yearly, and annual premium policies. During the grace period, the policy remains active and claims can be made. If the premium is not paid even within the grace period, the policy lapses. A lapsed policy can sometimes be revived within a specified period (usually 2-5 years) by paying all overdue premiums with interest and possibly undergoing a fresh medical examination. In health insurance, if a policy lapses, the waiting period benefits accumulated so far may be lost, and the policyholder may have to restart them upon renewal or buying a new policy. This makes timely premium payment particularly important for health insurance.",
  },
  {
    id: "term_012",
    topic: "No Claim Bonus (NCB)",
    category: "terminology",
    content:
      "No Claim Bonus (NCB) is a reward given by insurance companies for not making any claims during a policy year. In health insurance, NCB usually takes the form of an increase in the sum insured (typically 5-50% per claim-free year) without any additional premium. Some policies offer NCB as a premium discount instead. In motor insurance, NCB is provided as a discount on the own-damage premium at the time of renewal. The NCB discount starts at 20% for the first claim-free year and can go up to 50% for five consecutive claim-free years. NCB in motor insurance belongs to the policyholder, not the vehicle, and can be transferred when changing insurers or vehicles. If a claim is made during a policy year, the NCB is typically lost or reduced. Some insurers offer an NCB protection add-on in motor insurance, which allows you to make a claim without losing your accumulated NCB.",
  },
  {
    id: "term_013",
    topic: "Claim Settlement Ratio",
    category: "terminology",
    content:
      "Claim Settlement Ratio (CSR) is the percentage of claims settled by an insurance company out of the total claims received in a financial year. It is published annually by the IRDAI in its annual report. For example, if an insurer received 100 death claims and settled 97 of them, its CSR is 97%. A higher CSR generally indicates that the insurer is reliable in honoring claims. However, CSR should not be the only factor when choosing an insurer — the number of claims, reasons for rejection, and the speed of settlement also matter. In life insurance, the industry average CSR in India is typically above 95%. It is important to note that CSR is calculated for individual death claims and does not include maturity claims or survival benefits. The Incurred Claim Ratio (ICR) is a related metric used in health insurance, representing the ratio of claims paid to premiums collected.",
  },
  {
    id: "term_014",
    topic: "Free Look Period",
    category: "terminology",
    content:
      "The free look period is a window of time (usually 15-30 days from receiving the policy document) during which a new policyholder can review the terms and conditions of the policy and cancel it if not satisfied. If the policy is cancelled during the free look period, the insurer refunds the premium paid after deducting proportionate risk charges, stamp duty, and medical examination costs. The IRDAI mandates a minimum free look period of 15 days for offline policies and 30 days for policies purchased online. This provision protects consumers from being locked into unsuitable policies. The free look period is particularly useful if you realize that the policy terms are different from what was explained by the agent, or if you find a better alternative. It is important to carefully read the entire policy document during this period and not just rely on the marketing material or agent's verbal promises.",
  },
  {
    id: "term_015",
    topic: "Maturity Benefit",
    category: "terminology",
    content:
      "A maturity benefit is the amount paid by an insurance company to the policyholder when the policy reaches its maturity date (end of the policy term) and the policyholder is still alive. Maturity benefits are available in traditional life insurance plans like endowment policies, money-back plans, and whole life policies, but not in pure term insurance plans. The maturity benefit typically includes the sum assured plus any accumulated bonuses (reversionary bonuses and terminal bonuses) declared by the insurer over the policy term. In ULIPs (Unit Linked Insurance Plans), the maturity benefit is the fund value of the investments at the time of maturity. The maturity proceeds from a life insurance policy are generally tax-exempt under Section 10(10D) of the Income Tax Act, provided the premium paid in any year does not exceed 10% of the sum assured (for policies issued after April 2012). Maturity benefits provide a lump sum that can be used for financial goals like retirement, children's education, or other planned expenses.",
  },

  // ── Policy Type Explanations ───────────────────────────────

  {
    id: "policy_001",
    topic: "Term Life Insurance",
    category: "policy_types",
    content:
      "Term life insurance is the simplest and most affordable form of life insurance. It provides pure death protection for a specified period (the 'term'), such as 10, 20, or 30 years. If the policyholder dies during the policy term, the nominee receives the sum assured. If the policyholder survives the term, no payout is made (there is no maturity benefit). Because of this pure protection nature, term plans offer the highest coverage at the lowest premium compared to other life insurance types. For example, a healthy 30-year-old can get Rs 1 crore coverage for approximately Rs 600-800 per month. Key features include flexible payout options (lump sum, monthly income, or combination), rider options like critical illness and accidental death, and premium waiver benefits. Term insurance is particularly recommended for anyone with financial dependents. The ideal coverage amount is typically 10-15 times your annual income. Term plans are available from most major insurers in India and can be purchased online at even lower premiums.",
  },
  {
    id: "policy_002",
    topic: "Whole Life Insurance",
    category: "policy_types",
    content:
      "Whole life insurance provides coverage for the entire lifetime of the insured, typically up to age 99 or 100, unlike term insurance which covers only a specified period. It combines life protection with a savings component. The policyholder pays premiums for a fixed period (such as 10, 15, or 20 years), and the policy continues to provide coverage even after premium payments stop. Whole life policies accumulate a cash value over time through bonuses declared by the insurer. This cash value can be borrowed against or withdrawn. The sum assured plus accumulated bonuses are paid to the nominee upon the policyholder's death, regardless of when it occurs. Whole life insurance is suitable for those who want lifelong protection, estate planning, or want to leave a financial legacy. The premiums are higher than term insurance because of the guaranteed payout and savings component. Some whole life policies also offer limited pay options where premiums are paid for a shorter period while coverage continues for life.",
  },
  {
    id: "policy_003",
    topic: "Endowment Plans",
    category: "policy_types",
    content:
      "An endowment plan is a life insurance policy that combines insurance protection with savings. It pays a lump sum (sum assured plus bonuses) either on the maturity of the policy or on the death of the policyholder, whichever occurs first. This dual benefit makes endowment plans popular among conservative investors who want guaranteed returns along with life cover. The maturity benefit includes the sum assured plus reversionary bonuses (declared annually) and a terminal bonus (declared at maturity). Endowment plans have higher premiums compared to term insurance because part of the premium goes towards building the savings corpus. Common policy terms range from 10 to 30 years. While the returns from endowment plans (typically 4-6% per annum) are lower than market-linked instruments, they provide guaranteed returns and tax benefits. Premiums paid qualify for deduction under Section 80C, and the maturity proceeds are tax-exempt under Section 10(10D). Endowment plans are suitable for individuals who want a disciplined savings approach with the added benefit of life cover.",
  },
  {
    id: "policy_004",
    topic: "Money Back Policy",
    category: "policy_types",
    content:
      "A money back policy is a type of endowment plan that provides periodic payouts (survival benefits) at regular intervals during the policy term, rather than a single lump sum at maturity. For example, a 20-year money back policy might pay 20% of the sum assured every 5 years and the remaining 40% plus bonuses at maturity. If the policyholder dies during the term, the full sum assured (not reduced by survival benefits already paid) plus bonuses are paid to the nominee. This structure provides liquidity at regular intervals, making it useful for planned expenses like children's education milestones. The survival benefit payouts can range from every 3 years to every 5 years depending on the plan. Money back plans have higher premiums compared to endowment plans because of the periodic liquidity feature. The returns are generally modest (around 4-5% per annum). These plans are best suited for conservative investors who need periodic cash flows and want the security of life coverage.",
  },
  {
    id: "policy_005",
    topic: "Pension and Annuity Plans",
    category: "policy_types",
    content:
      "Pension and annuity plans are insurance products designed to provide regular income after retirement. During the accumulation phase, the policyholder pays premiums which build up a retirement corpus. At the vesting age (typically 55-70 years), the accumulated corpus can be used to purchase an annuity, which provides regular pension payments for life. As per Indian regulations, at least 40% of the corpus must be used to purchase an annuity, while the remaining 60% can be withdrawn as a lump sum (tax-free). There are two main types: deferred annuity plans (where premiums are paid over years and pension starts later) and immediate annuity plans (where a lump sum is invested and pension payments begin immediately). Annuity options include life annuity (payments until death), life annuity with return of purchase price (payments until death plus corpus returned to nominee), joint life annuity (payments continue until both spouses pass), and annuity certain (guaranteed payments for a specific period). Premiums for pension plans qualify for tax deduction under Section 80CCC.",
  },
  {
    id: "policy_006",
    topic: "Child Insurance Plans",
    category: "policy_types",
    content:
      "Child insurance plans are designed to build a financial corpus for a child's future needs, primarily education and marriage expenses. The parent (or guardian) is the policyholder and premium payer, while the child is the beneficiary. A key feature of child plans is the premium waiver benefit — if the parent dies or becomes disabled during the policy term, all future premiums are waived by the insurer, but the policy continues and the child receives all planned benefits at maturity. This ensures the child's financial goals are not disrupted. Child plans can be traditional (endowment-style with guaranteed returns) or ULIP-based (market-linked with higher growth potential). Investments typically mature when the child reaches 18-25 years of age, coinciding with higher education expenses. Some plans offer step-up payouts at different stages — for instance, partial payouts for school, college, and graduation. The premium depends on the parent's age, health, and the desired corpus amount. Starting early results in lower premiums and longer compounding time. Premiums qualify for tax deduction under Section 80C.",
  },
  {
    id: "policy_007",
    topic: "ULIPs (Unit Linked Insurance Plans)",
    category: "policy_types",
    content:
      "ULIPs (Unit Linked Insurance Plans) combine life insurance with investment. A portion of the premium goes towards life cover, while the rest is invested in funds of the policyholder's choice — equity, debt, balanced, or hybrid funds. The policyholder can switch between funds based on market conditions and risk appetite. ULIPs have a mandatory 5-year lock-in period, during which the invested amount cannot be withdrawn. Key charges include premium allocation charges, fund management charges (capped at 1.35% by IRDAI), mortality charges, and policy administration charges. After the lock-in period, partial withdrawals are allowed. ULIPs offer flexibility in investment strategy and are transparent about charges and fund performance. The returns are market-linked and not guaranteed. ULIPs are suitable for individuals with a long-term investment horizon (10+ years) who want the dual benefit of insurance and market-linked returns. Maturity proceeds and death benefits from ULIPs are tax-exempt under Section 10(10D), and premiums qualify for Section 80C deduction, making them tax-efficient.",
  },
  {
    id: "policy_008",
    topic: "Health Insurance",
    category: "policy_types",
    content:
      "Health insurance covers medical expenses incurred due to hospitalization, surgeries, and treatments. In India, health insurance can be individual (covering one person), family floater (covering the entire family under a single sum insured), or group (provided by employers). Key features include cashless treatment at network hospitals, pre and post hospitalization expenses (typically 30-60 days before and 60-180 days after), day-care procedures, ambulance charges, and domiciliary treatment. Most health policies have waiting periods for pre-existing diseases (2-4 years), specific diseases (1-2 years), and an initial waiting period (30 days). Important features to look for include room rent limits (or no limits), co-payment clauses, sub-limits on specific treatments, restore/refill benefits, no-claim bonus, and AYUSH treatment coverage. Health insurance premiums qualify for tax deduction under Section 80D — up to Rs 25,000 for self and family, and an additional Rs 25,000-50,000 for parents. Buying health insurance early in life results in lower premiums and immediate coverage for most conditions.",
  },
  {
    id: "policy_009",
    topic: "Personal Accident Insurance",
    category: "policy_types",
    content:
      "Personal accident insurance provides financial protection against death, disability, or injury caused by accidents. Unlike health insurance which covers hospitalization from any cause, personal accident insurance specifically covers accidental events. Benefits include accidental death benefit (100% of sum insured), permanent total disability (100% of sum insured), permanent partial disability (a percentage based on the type of disability), and temporary total disability (weekly compensation for the period of disability). Some policies also cover accidental hospitalization expenses, ambulance charges, and children's education benefit if the breadwinner dies in an accident. Personal accident insurance is relatively inexpensive — a Rs 10 lakh cover typically costs Rs 1,500-3,000 per year. It is particularly important for individuals who travel frequently, work in hazardous environments, or have high-risk occupations. This insurance works as a complement to life and health insurance, providing additional financial protection specifically for accident-related events.",
  },
  {
    id: "policy_010",
    topic: "Group Health Insurance",
    category: "policy_types",
    content:
      "Group health insurance is a health insurance policy purchased by an organization (employer, association, or group) to cover its members or employees. It is one of the most common employee benefits in India. Key advantages over individual policies include no waiting period for pre-existing diseases (coverage from day 1), no individual medical underwriting (all employees are covered regardless of health), lower premiums per person due to group discounts, and coverage for dependents (spouse, children, and sometimes parents). Group health policies typically cover hospitalization, day-care treatments, pre and post hospitalization expenses, and maternity benefits. The employer pays the premium, though some companies offer top-up options for employees who want higher coverage at their own cost. A significant limitation is that coverage ends when the employee leaves the organization. Therefore, it is advisable to have an individual health policy alongside the group cover. Some insurers allow porting of group health insurance benefits to an individual policy upon exit from the organization.",
  },
  {
    id: "policy_011",
    topic: "Motor Insurance",
    category: "policy_types",
    content:
      "Motor insurance provides financial protection against losses arising from accidents involving your vehicle. In India, there are two main types: Third-Party (TP) liability insurance (mandatory by law under the Motor Vehicles Act) and Comprehensive insurance (covers both third-party liability and own damage). Third-party insurance covers damages you cause to another person, their vehicle, or property. It does not cover damage to your own vehicle. Comprehensive insurance covers everything in TP plus damage to your own vehicle from accidents, theft, fire, natural disasters, and vandalism. Important add-on covers include Zero Depreciation (insurer pays full claim without depreciation deduction), Engine Protection (covers engine damage from water ingress), Roadside Assistance, Return to Invoice (covers difference between insured declared value and invoice price in case of total loss), and Key Replacement. The IRDAI sets third-party premium rates, but own-damage premiums vary between insurers. No Claim Bonus (NCB) discounts of 20-50% are available for claim-free years. Motor insurance must be renewed annually, and driving without at least third-party insurance is a punishable offense in India.",
  },
  {
    id: "policy_012",
    topic: "Travel Insurance",
    category: "policy_types",
    content:
      "Travel insurance provides coverage for unexpected events during domestic or international trips. Key coverages include medical emergency expenses abroad, emergency medical evacuation, trip cancellation or interruption, loss of baggage and personal belongings, loss of passport, flight delay compensation, and personal liability. For international travel, medical coverage is particularly important as healthcare costs in countries like the USA and Europe can be extremely high. Some countries in the Schengen zone require travel insurance as a visa condition. Travel insurance is available as single-trip policies (covering one specific trip) or multi-trip policies (covering all trips within a year, usually with a per-trip duration limit). Adventure sports cover is available as an add-on for activities like trekking, scuba diving, and skiing. When choosing travel insurance, check the geographical coverage, sum insured for medical expenses (at least $50,000-$100,000 for international trips), exclusions, and the insurer's global assistance network for cashless treatment.",
  },
  {
    id: "policy_013",
    topic: "Home Insurance",
    category: "policy_types",
    content:
      "Home insurance provides financial protection for your house and its contents against various risks. There are two components: structure insurance (covers the building structure against fire, earthquake, flood, storm, explosion, and riot) and contents insurance (covers household items like furniture, electronics, appliances, and valuables against theft, fire, and natural disasters). Some comprehensive policies combine both. Additional coverages may include rent for alternative accommodation if the home becomes uninhabitable, public liability, domestic worker coverage, and coverage for valuable items like jewelry and art. Home insurance is relatively inexpensive in India — a Rs 50 lakh cover for the structure might cost Rs 1,500-3,000 per year. Despite this, home insurance penetration in India is very low. If you have taken a home loan, the lender may require home insurance as a condition. When choosing a policy, ensure the sum insured is adequate to cover the reconstruction cost of your home (not the market value which includes land). Contents should be insured at replacement value.",
  },
  {
    id: "policy_014",
    topic: "Commercial Property Insurance",
    category: "policy_types",
    content:
      "Commercial property insurance protects businesses against financial losses arising from damage to their physical assets. It covers the business premises, equipment, inventory, furniture, and other business property against risks like fire, theft, natural disasters, vandalism, and civil disturbances. Business Interruption insurance, often bundled with commercial property insurance, covers the loss of income a business suffers when it cannot operate due to a covered peril. It compensates for ongoing expenses like rent, salaries, and loan payments during the restoration period. Additional coverages include electronic equipment insurance, fidelity guarantee (protecting against employee dishonesty), money insurance (covering cash in transit or on premises), and public liability (covering injuries to customers or visitors on business premises). The premium depends on the type of business, location, construction of the building, fire protection measures, and the sum insured. Having commercial property insurance is essential for business continuity and is often required by lenders, landlords, and business partners.",
  },
  {
    id: "policy_015",
    topic: "Fire Insurance",
    category: "policy_types",
    content:
      "Fire insurance protects property and assets against damage or destruction caused by fire and allied perils. The Standard Fire and Special Perils Policy in India covers fire, lightning, explosion, implosion, aircraft damage, riot and strike damage, storm, tempest, flood, earthquake, and subsidence. Add-on covers are available for risks like spontaneous combustion, forest fire, and impact damage. Fire insurance can be purchased for residential properties, commercial properties, industrial establishments, and stock/inventory. The premium depends on the type of property, construction materials, fire safety measures in place, and the sum insured. Properties with fire safety equipment (sprinklers, fire alarms, fire extinguishers) may qualify for premium discounts. The sum insured should be based on the reinstatement or replacement value of the property and contents, not the market value. In India, fire insurance policies are governed by the Indian Insurance Act and regulated by the IRDAI. For businesses, fire insurance is often the first line of protection and can be combined with business interruption insurance for comprehensive coverage.",
  },
  {
    id: "policy_016",
    topic: "Marine Insurance",
    category: "policy_types",
    content:
      "Marine insurance covers losses or damages to ships, cargo, terminals, and transport during the movement of goods from origin to destination. For businesses involved in trade and logistics, marine insurance is essential. There are three main types: Marine Cargo Insurance (covers goods being transported), Marine Hull Insurance (covers the vessel itself), and Marine Liability Insurance (covers third-party obligations). Institute Cargo Clauses define three levels of coverage: ICC(A) provides all-risk coverage, ICC(B) covers named perils including fire, vessel sinking, and overturning, and ICC(C) provides the most basic coverage for major casualties only. Marine insurance can be purchased as a single transit policy (for one shipment), an open policy (covering all shipments over a period), or an open cover (a standing arrangement between the insured and insurer). The premium depends on the type of goods, mode of transport (sea, air, road, or multimodal), shipping route, packaging standards, and claims history. For international trade, marine insurance is often a requirement under trade terms (Incoterms).",
  },
  {
    id: "policy_017",
    topic: "Cyber Insurance",
    category: "policy_types",
    content:
      "Cyber insurance protects businesses and individuals against financial losses from cyber attacks, data breaches, and other digital threats. As businesses increasingly rely on digital infrastructure, cyber risks have become a major concern. Cyber insurance typically covers: first-party losses (data restoration costs, business interruption from cyber events, cyber extortion/ransomware payments, forensic investigation costs, notification costs to affected customers, and crisis management/PR expenses) and third-party liabilities (lawsuits from affected customers, regulatory fines and penalties, media liability, and payment card industry fines). Additional coverages may include social engineering fraud, funds transfer fraud, and reputational harm. The premium depends on the company's revenue, industry, number of records stored, cybersecurity measures in place, and claims history. Companies with robust security practices (multi-factor authentication, encryption, regular security audits) may qualify for premium discounts. Cyber insurance is becoming increasingly important in India with the implementation of the Digital Personal Data Protection Act and growing regulatory scrutiny on data handling.",
  },
  {
    id: "policy_018",
    topic: "Pet Insurance",
    category: "policy_types",
    content:
      "Pet insurance covers veterinary treatment costs and other expenses related to your pet's health and well-being. In India, pet insurance is a relatively new but growing segment. Coverage typically includes veterinary treatment for illness and injury, surgery costs, hospitalization, third-party liability (if your pet injures someone or damages property), mortality/death benefit, and theft or straying. Some comprehensive policies also cover vaccination costs, OPD expenses, and emergency boarding. Common exclusions include pre-existing conditions, cosmetic procedures, breeding-related costs, experimental treatments, and injuries from fights (in some policies). The premium depends on the pet type (dogs are most commonly insured, followed by cats), breed, age, and the coverage amount. Most insurers accept pets aged between 8 weeks to 8-10 years for enrollment. Older pets may face higher premiums or limited coverage. It is important to microchip your pet as many insurers require it and some offer premium discounts for microchipped pets. Keep all vaccination records updated as proof of preventive care.",
  },
  {
    id: "policy_019",
    topic: "Agricultural Insurance",
    category: "policy_types",
    content:
      "Agricultural insurance protects farmers against financial losses from crop failure, natural calamities, and livestock death. The most prominent scheme in India is the Pradhan Mantri Fasal Bima Yojana (PMFBY), which provides crop insurance at subsidized premiums. Under PMFBY, the farmer's premium is just 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops, with the rest subsidized by the government. Coverage includes yield losses due to natural calamities (drought, flood, hailstorm, cyclone, pest infestation), prevented sowing (when the farmer cannot sow due to adverse conditions), post-harvest losses (for up to 14 days after harvest for specified crops), and localized calamity losses. Weather-based crop insurance is another type that uses weather parameters (rainfall, temperature, humidity) as triggers for automatic payouts, eliminating the need for field inspection. Livestock insurance covers death of animals due to disease, accident, or natural calamity. Agricultural insurance is crucial for Indian farmers, as agriculture is highly dependent on weather conditions and natural factors beyond the farmer's control.",
  },
  {
    id: "policy_020",
    topic: "Political Risk Insurance",
    category: "policy_types",
    content:
      "Political risk insurance protects businesses and investors against financial losses caused by political events in the countries where they operate or invest. This is particularly relevant for companies engaged in international trade, foreign direct investment, or operations in politically unstable regions. Common political risks covered include expropriation or nationalization (government seizing private assets), currency inconvertibility (inability to convert local currency to a transferable currency), political violence (damage from war, terrorism, civil unrest, or revolution), contract frustration (government actions that prevent contract fulfillment), and sovereign default (government failing to honor financial obligations). Political risk insurance is offered by government agencies (like ECGC in India) and private insurers. The premium depends on the country's risk rating, investment amount, duration, and the specific risks covered. For Indian companies expanding globally or foreign companies investing in emerging markets, political risk insurance provides essential protection against unpredictable governmental and political actions that could result in significant financial losses.",
  },
  {
    id: "policy_021",
    topic: "Terrorism Insurance",
    category: "policy_types",
    content:
      "Terrorism insurance provides coverage for property damage and business interruption losses resulting from acts of terrorism. In India, the Indian Market Terrorism Risk Insurance Pool, managed by the General Insurance Corporation (GIC Re), provides terrorism coverage. Standard property insurance policies in India typically exclude terrorism-related losses, making separate terrorism cover essential for businesses in high-risk areas. Coverage includes physical damage to property from terrorist acts (bombings, attacks, sabotage), business interruption losses (revenue lost during the period the business cannot operate), debris removal costs, and loss of rent for landlords. The premium depends on the location of the property (metro cities generally have higher premiums), property type (commercial, industrial, or residential), security measures in place, and the sum insured. Properties with security certifications and robust security infrastructure may qualify for premium discounts. Terrorism insurance does not typically cover nuclear, chemical, or biological terrorism events, which require specialized coverage. Businesses located in metros or near sensitive areas should consider this coverage as part of their risk management strategy.",
  },

  // ── Comparisons ────────────────────────────────────────────

  {
    id: "comp_001",
    topic: "Term Insurance vs Whole Life Insurance",
    category: "comparisons",
    content:
      "Term insurance and whole life insurance serve different purposes. Term insurance provides pure protection for a specific period at low premiums. If you survive the term, there is no payout. Whole life insurance covers you for your entire life (typically up to age 99-100) and includes a savings component that builds cash value over time. Key differences: Premiums — term insurance costs significantly less (Rs 600-1000/month for Rs 1 crore cover for a 30-year-old) compared to whole life (Rs 3000-8000/month for similar cover). Maturity benefit — term plans have none, while whole life pays sum assured plus bonuses. Flexibility — term plans are straightforward, whole life offers cash value loans and paid-up options. Best for — term insurance is ideal for income replacement during working years, covering loans, and protecting dependents. Whole life is better for estate planning, lifelong protection, and creating a legacy. Most financial advisors recommend buying an adequate term plan first for protection and investing the premium difference in mutual funds or other instruments for wealth creation, rather than relying solely on whole life insurance for both.",
  },
  {
    id: "comp_002",
    topic: "Endowment Plan vs ULIP",
    category: "comparisons",
    content:
      "Endowment plans and ULIPs both combine insurance with investment, but they differ significantly. Endowment plans offer guaranteed returns through declared bonuses (typically 4-6% p.a.) and are suitable for risk-averse individuals. ULIPs invest in market-linked funds (equity, debt, balanced) with no guaranteed returns but potentially higher growth. Risk level — endowment plans carry minimal risk with guaranteed returns; ULIPs carry market risk with returns depending on fund performance. Transparency — ULIPs are more transparent with clearly disclosed charges and daily NAV tracking; endowment plans have less visibility into bonus calculations. Flexibility — ULIPs allow fund switching and partial withdrawals after the 5-year lock-in; endowment plans have rigid structures. Charges — ULIPs have explicit charges (fund management, mortality, administration); endowment plans absorb charges within the premium structure. Tax treatment — both enjoy similar tax benefits under Section 80C and 10(10D). Recommendation — endowment plans suit conservative savers wanting guaranteed returns, while ULIPs suit investors with a longer horizon (10+ years) willing to accept market volatility for potentially higher returns.",
  },
  {
    id: "comp_003",
    topic: "Health Insurance vs Personal Accident Insurance",
    category: "comparisons",
    content:
      "Health insurance and personal accident insurance are complementary but cover different risks. Health insurance covers hospitalization expenses arising from any cause — illness, disease, surgery, or accident. Personal accident insurance specifically covers death, disability, and injuries caused only by accidents. Coverage scope — health insurance pays for hospital bills, doctor fees, medicines, and diagnostic tests; personal accident pays a fixed sum for death/disability and may include hospitalization expense coverage specifically for accidents. Claim trigger — health insurance requires actual hospitalization or medical treatment; personal accident insurance pays predetermined amounts based on the type of injury/disability regardless of actual medical costs. Premium — personal accident insurance is significantly cheaper (Rs 1,500-3,000/year for Rs 10 lakh cover) compared to health insurance (Rs 8,000-25,000/year for similar sum insured). Recommendation — you need both. Health insurance is your primary medical coverage. Personal accident insurance supplements it with additional financial protection specifically for accidents, including non-medical financial impacts like loss of income during recovery. Having only one leaves gaps in your overall protection.",
  },
  {
    id: "comp_004",
    topic: "Comprehensive vs Third-Party Motor Insurance",
    category: "comparisons",
    content:
      "In India, third-party (TP) motor insurance is mandatory by law, while comprehensive insurance is optional but highly recommended. Third-party insurance covers your legal liability if you cause injury, death, or property damage to a third party while using your vehicle. It does NOT cover any damage to your own vehicle. Comprehensive insurance includes all third-party coverages PLUS protection for your own vehicle against accidents, theft, fire, natural disasters, vandalism, and personal accident cover for the owner-driver. Cost comparison — TP premiums are fixed by the IRDAI and are relatively low (e.g., Rs 2,094/year for a car up to 1000cc). Comprehensive premiums are higher as they include own-damage cover, but the additional protection is well worth the cost. Add-ons available only with comprehensive insurance include zero depreciation, engine protection, roadside assistance, return to invoice, and consumable cover. Recommendation — always opt for comprehensive insurance, especially for newer vehicles. The small additional premium provides significant financial protection. For very old vehicles where the IDV (Insured Declared Value) is low, some owners choose only TP coverage, but this is risky as even minor accidents can cost substantial amounts to repair.",
  },
  {
    id: "comp_005",
    topic: "Individual Health vs Family Floater Health Insurance",
    category: "comparisons",
    content:
      "Individual health insurance covers a single person with a dedicated sum insured. A family floater covers the entire family (self, spouse, children, and sometimes parents) under a single policy with a shared sum insured. Cost — a family floater is generally cheaper than buying separate individual policies for each family member because the premium is based on the oldest member's age. For example, covering a family of 4 with a Rs 10 lakh floater may cost Rs 15,000-20,000/year, while individual Rs 10 lakh policies for each member could cost Rs 40,000-50,000 combined. Risk consideration — the key drawback of a floater is that the sum insured is shared. If one family member has a major claim that exhausts the sum insured, other members are left without coverage for the rest of the year (unless the policy has a restore benefit). With individual policies, each person has their own dedicated coverage. Recommendation — a family floater is economical for young families with a low probability of multiple large claims in the same year. For families with elderly members or those with pre-existing conditions, individual policies may be more prudent. A hybrid approach — family floater for the younger members and separate individual policies for older parents — is often the best strategy.",
  },
  {
    id: "comp_006",
    topic: "Cashless vs Reimbursement Health Insurance Claims",
    category: "comparisons",
    content:
      "Health insurance claims can be settled through two methods: cashless and reimbursement. In a cashless claim, the insured gets treatment at a network hospital and the insurer directly settles the bill with the hospital. The policyholder only pays non-covered items and any co-pay/deductible. In a reimbursement claim, the policyholder pays the hospital bills upfront and then submits documents to the insurer to get the eligible amount reimbursed. Cashless advantages — no upfront financial burden, faster and smoother process, pre-authorized treatment amounts. Cashless limitations — available only at network hospitals, pre-authorization required (which can take hours), insurer may approve only a partial amount initially. Reimbursement advantages — freedom to choose any hospital, no restriction to the insurer's network, useful in emergencies where network hospitals are not accessible. Reimbursement limitations — requires upfront payment which can be substantial, claim processing takes 15-30 days, paperwork is more extensive. To make a cashless claim, you need to inform the insurer's TPA (Third-Party Administrator) at least 48 hours before planned hospitalization, or within 24 hours for emergencies.",
  },
  {
    id: "comp_007",
    topic: "Traditional Plans vs Market-Linked Plans",
    category: "comparisons",
    content:
      "Traditional insurance plans (endowment, money-back, whole life) and market-linked plans (ULIPs) represent two fundamentally different approaches to insurance-cum-investment products. Traditional plans offer guaranteed returns through bonuses declared by the insurer. The sum assured is fixed, and returns are modest but predictable (typically 4-6% p.a.). The investment is managed by the insurer, and the policyholder has no control over asset allocation. Market-linked plans (ULIPs) invest in equity, debt, or balanced funds based on the policyholder's choice. Returns are not guaranteed and depend entirely on market performance. The policyholder can actively manage their investment through fund switches. In good market conditions, ULIPs can deliver significantly higher returns (10-15% p.a. in equity funds over long periods), but they also carry the risk of losses. Suitability — traditional plans for conservative investors, those nearing retirement, or those wanting guaranteed returns. ULIPs for younger investors with a high risk appetite and long investment horizon (10+ years). Important to note — neither traditional plans nor ULIPs are primarily investment products; they should be considered for their insurance component first.",
  },
  {
    id: "comp_008",
    topic: "Single Premium vs Regular Premium Policies",
    category: "comparisons",
    content:
      "Insurance policies can be purchased with a single lump-sum premium or through regular premium payments. Single premium policies require one upfront payment for the entire policy term. Regular premium policies spread the cost over the policy term through monthly, quarterly, half-yearly, or annual payments. Single premium advantages — no risk of policy lapsing due to missed payments, immediate full coverage, potential for higher returns due to early investment of the full amount, and convenience. Single premium disadvantages — requires a large upfront investment, tax benefits under Section 80C are limited to one year, and the premium amount must be significant for adequate coverage. Regular premium advantages — manageable payments spread over time, tax benefits every year premiums are paid, disciplined savings habit, and flexibility to choose payment frequency. Regular premium disadvantages — risk of policy lapsing if premiums are missed, total premiums paid over the term may be higher than single premium, and requires long-term commitment to payment schedule. Single premium is suitable for those receiving a lump sum (from inheritance, bonus, or retirement benefits), while regular premium suits salaried individuals with steady income.",
  },

  // ── How Claims Work ────────────────────────────────────────

  {
    id: "claim_001",
    topic: "How to File an Insurance Claim",
    category: "claims",
    content:
      "Filing an insurance claim involves several steps that vary by insurance type but follow a general process. Step 1: Notify the insurer as soon as possible. Most policies require notification within a specific timeframe — immediately for motor accidents, within 24-48 hours for health emergencies, and within the policy-specified period for life insurance death claims. Step 2: Gather required documents. These typically include the policy document, claim form (available on the insurer's website or app), identity proof, incident-related documents (FIR for theft/accident, death certificate for life claims, hospital bills for health claims), photographs of damage (for motor and property claims), and bank details for claim payment. Step 3: Submit the claim form and documents. This can be done online through the insurer's portal, through the agent or broker, or at the insurer's branch office. Step 4: Insurer assigns a surveyor or investigator to assess the claim (for motor and property claims). Step 5: Claim assessment and approval — the insurer reviews all documents and determines the claim amount. Step 6: Payment — approved claims are settled via bank transfer, usually within 30 days as mandated by the IRDAI.",
  },
  {
    id: "claim_002",
    topic: "Cashless Claim Process in Health Insurance",
    category: "claims",
    content:
      "The cashless claim process in health insurance allows you to get treatment at a network hospital without paying upfront. Here is how it works: For planned hospitalization — contact the insurer's TPA (Third-Party Administrator) or the insurer directly at least 48-72 hours before admission. Submit a pre-authorization form (available at the hospital's insurance desk or TPA website) along with the doctor's recommendation and estimated treatment cost. The TPA reviews the request and either approves, partially approves, or rejects it, usually within 2-6 hours. For emergency hospitalization — get admitted first and inform the TPA within 24 hours. Submit the pre-authorization form from the hospital. During treatment — the hospital coordinates with the TPA for any additional approvals if costs exceed the pre-authorized amount. At discharge — the insurer settles the approved amount directly with the hospital. You pay only the non-covered items (personal expenses, items not covered by the policy) and any co-pay or deductible. Important tips: always carry your health card and policy details, choose a network hospital, and keep the TPA's helpline number handy.",
  },
  {
    id: "claim_003",
    topic: "Documents Required for Insurance Claims",
    category: "claims",
    content:
      "Each type of insurance claim requires specific documentation. Life Insurance Death Claim: death certificate, policy document, claimant's identity proof, nominee's identity and bank details, FIR (if death due to accident), medical records (if death due to illness), and the insurer's claim form. Health Insurance Claim: completed claim form, hospital discharge summary, detailed hospital bills and receipts, prescription and diagnostic reports, pharmacy bills, doctor's referral letter, policy health card, and KYC documents. Motor Insurance Claim: completed claim form, copy of RC (Registration Certificate) and driving license, FIR or police complaint (for theft or third-party claims), photographs of damage, repair estimates or bills, surveyor's report, and policy document. Property Insurance Claim: claim form, FIR (for theft or vandalism), photographs of damage, list of damaged/stolen items with values, repair or replacement estimates, and surveyor's report. General tips: keep digital copies of all documents, file the claim promptly within the notification period, provide complete and accurate information, and maintain a record of all communication with the insurer.",
  },
  {
    id: "claim_004",
    topic: "Understanding Claim Settlement Ratio and Process Time",
    category: "claims",
    content:
      "The Claim Settlement Ratio (CSR) and the speed of settlement are two critical metrics when evaluating insurers. The IRDAI publishes CSR data annually. For life insurance, the industry average CSR in India is typically above 95%, with top insurers settling 98-99% of claims. A high CSR indicates the insurer is reliable in paying claims. However, look beyond the headline number — check the total number of claims (a high CSR on very few claims is less meaningful), repudiation reasons, and pending claim ratios. Regarding claim settlement time, the IRDAI mandates that claims should be settled within 30 days from the date of receiving all required documents. If the claim requires investigation, the insurer must complete it within 90 days. For health insurance, cashless claims at network hospitals are usually settled within 2-4 hours for pre-authorization and at discharge. Reimbursement claims typically take 15-30 days. For motor insurance, own-damage claims are usually settled within 7-15 days after the surveyor's assessment. If you face delays beyond the mandated timelines, you can approach the Insurance Ombudsman or the IRDAI Grievance Cell for resolution.",
  },
  {
    id: "claim_005",
    topic: "Common Reasons for Claim Rejection",
    category: "claims",
    content:
      "Understanding why claims get rejected can help you avoid common pitfalls. Non-disclosure or misrepresentation: Failing to disclose pre-existing conditions, smoking habits, or other material information at the time of buying the policy is the number one reason for claim rejection. Insurers can investigate and reject claims if they find the policyholder withheld important information. Policy exclusions: Claims for situations explicitly excluded in the policy (e.g., cosmetic surgery in health insurance, drunk driving in motor insurance) will be denied. Lapsed policy: If premiums were not paid and the policy had lapsed before the claim event, the claim will be rejected. Waiting period: Claims during the waiting period for pre-existing diseases or specified illnesses are not payable. Insufficient documentation: Incomplete or incorrect documentation can delay or lead to rejection of claims. Policy condition violations: Not following policy conditions like late notification (reporting the claim beyond the required timeframe) or unauthorized repairs (in motor insurance). To protect yourself: always disclose all information honestly, read policy terms carefully, pay premiums on time, keep documentation complete, and report incidents promptly.",
  },

  // ── Indian Insurance Basics ────────────────────────────────

  {
    id: "india_001",
    topic: "IRDAI - Insurance Regulator of India",
    category: "indian_insurance",
    content:
      "The Insurance Regulatory and Development Authority of India (IRDAI) is the statutory body that regulates and promotes the insurance industry in India. Established in 1999 under the IRDAI Act, it is headquartered in Hyderabad. Key functions include granting registration to insurance companies, regulating and supervising their functioning, protecting policyholder interests, framing regulations for insurance activities, specifying the code of conduct for intermediaries, and promoting financial literacy about insurance. Important IRDAI regulations that protect consumers include: mandatory 15-30 day free look period, mandated claim settlement timelines (30 days), standardized policy wordings, agent licensing requirements, grievance redressal mechanisms, and caps on insurance company charges. IRDAI also publishes annual data on claim settlement ratios, financial performance of insurers, and industry statistics. If you have a complaint against an insurer that is not resolved satisfactorily, you can approach IRDAI through their Integrated Grievance Management System (IGMS) at igms.irda.gov.in. IRDAI has been instrumental in modernizing the Indian insurance industry, promoting digital insurance sales, and increasing insurance penetration across the country.",
  },
  {
    id: "india_002",
    topic: "Indian Insurance Market Overview",
    category: "indian_insurance",
    content:
      "The Indian insurance market is one of the fastest-growing in the world, yet insurance penetration remains low at approximately 4% of GDP (compared to the global average of over 6%). The Indian insurance sector was opened to private players in 2000, ending the monopoly of government-owned insurers. Currently, there are 24 life insurance companies (LIC and 23 private players) and 34 general insurance companies operating in India. LIC continues to dominate the life insurance market with approximately 60-65% market share, though private players are growing rapidly. In general insurance, the four public sector companies (New India, United India, National Insurance, Oriental Insurance) together hold about 35-40% market share. Key growth drivers include increasing awareness, rising middle-class income, government initiatives like PMFBY and Ayushman Bharat, digital distribution, and regulatory reforms. However, challenges remain — insurance products are still seen as tax-saving instruments rather than protection tools, rural penetration is low, and claim settlement processes need improvement. The IRDAI has been pushing for greater penetration through initiatives like sandbox regulations for innovative products and promoting micro-insurance for lower-income segments.",
  },
  {
    id: "india_003",
    topic: "Public vs Private Insurers in India",
    category: "indian_insurance",
    content:
      "India has both public sector (government-owned) and private sector insurance companies. In life insurance, LIC (Life Insurance Corporation of India) is the sole public sector player, established in 1956. In general insurance, there are four public sector companies: New India Assurance, United India Insurance, National Insurance Company, and Oriental Insurance. Private insurers entered the market in 2000. Public sector advantages include government backing, extensive branch networks especially in rural areas, trust built over decades, and large claim-handling experience. Private sector advantages include innovative products, better technology and digital services, faster claim settlement processes, superior customer service, and competitive pricing. When choosing between public and private insurers, consider: claim settlement ratio (many private insurers now match or exceed public sector ratios), product features, premium cost, customer service quality, digital experience, and network hospital or garage tie-ups. The choice between public and private should be based on the specific product, service quality, and your individual needs rather than a blanket preference for one over the other.",
  },
  {
    id: "india_004",
    topic: "Insurance Ombudsman in India",
    category: "indian_insurance",
    content:
      "The Insurance Ombudsman is a quasi-judicial authority established to resolve insurance-related grievances of policyholders in a cost-effective and speedy manner. There are 17 Insurance Ombudsman offices across India, each covering specific territories. Any policyholder who is dissatisfied with the insurer's response to their complaint can approach the Ombudsman. The complaint must first be made to the insurer, and if the response is not received within 30 days or is unsatisfactory, the Ombudsman can be approached within one year of the insurer's final response. The Ombudsman handles complaints related to claim delays, claim rejections, premium disputes, policy document issues, and non-issuance of policy after receiving premium. The complaint can be filed online, by post, or in person. The Ombudsman's decision is binding on the insurer but not on the policyholder — if the policyholder is not satisfied with the Ombudsman's decision, they can still approach consumer courts or the IRDAI. The process is free of cost and does not require a lawyer. The Ombudsman must give a recommendation within 30 days and a final award within 3 months of receiving all documents.",
  },
  {
    id: "india_005",
    topic: "Insurance Laws and Regulations in India",
    category: "indian_insurance",
    content:
      "Insurance in India is governed by several key laws and regulations. The Insurance Act, 1938 is the primary legislation governing the insurance business in India. It covers registration of insurers, policyholder rights, nomination rules, policy assignment, and premium payment regulations. The IRDAI Act, 1999 established the IRDAI as the regulatory body. The Motor Vehicles Act, 1988 mandates third-party motor insurance for all vehicles. Key regulatory provisions that protect policyholders include: Section 39 of the Insurance Act (nomination provisions), Section 45 (no policy can be called into question after 3 years on grounds of misrepresentation), Section 38 (assignment of policy), and the IRDAI Protection of Policyholder's Interests Regulations. Recent regulatory developments include the introduction of standard health insurance products (Arogya Sanjeevani), sandbox regulations for innovative products, digital-first insurance distribution guidelines, and the increase in FDI limit in insurance companies from 49% to 74%. These regulations collectively ensure a fair, transparent, and consumer-friendly insurance ecosystem in India.",
  },

  // ── Tax Benefits ───────────────────────────────────────────

  {
    id: "tax_001",
    topic: "Section 80C - Life Insurance Tax Benefits",
    category: "tax_benefits",
    content:
      "Section 80C of the Income Tax Act allows a deduction of up to Rs 1,50,000 per financial year from taxable income for premiums paid towards life insurance policies. This applies to policies on the life of self, spouse, or children. The premium paid must not exceed 10% of the sum assured (for policies issued after April 2012) to qualify for the deduction. Both traditional plans (endowment, whole life, money-back) and ULIPs qualify under Section 80C. Term insurance premiums also qualify. Annuity plan premiums qualify under the related Section 80CCC, which shares the overall Rs 1,50,000 limit of Section 80C. Important conditions: if a policy is surrendered or discontinued before paying premiums for 2 years, any tax deductions claimed in previous years become taxable as income in the year of surrender. For policies issued before April 2012, the premium should not exceed 20% of the sum assured. Section 80C also covers other investments like PPF, ELSS, NSC, and home loan principal repayment — so the combined deduction across all these instruments is limited to Rs 1,50,000.",
  },
  {
    id: "tax_002",
    topic: "Section 80D - Health Insurance Tax Benefits",
    category: "tax_benefits",
    content:
      "Section 80D of the Income Tax Act provides tax deduction for health insurance premiums paid. The deduction limits are: up to Rs 25,000 for premiums paid for self, spouse, and dependent children; an additional Rs 25,000 for premiums paid for parents (Rs 50,000 if parents are senior citizens aged 60+). For senior citizen policyholders (self or spouse), the limit for self-family increases to Rs 50,000. The maximum possible deduction under Section 80D is Rs 1,00,000 (Rs 50,000 for self/family as senior citizen + Rs 50,000 for senior citizen parents). Additionally, preventive health check-up expenses up to Rs 5,000 per year qualify for deduction within the overall limits. The deduction is available for premiums paid towards individual health policies, family floater policies, and top-up/super top-up policies. Premiums paid in cash do not qualify for deduction (except for preventive health check-up); payment must be made by cheque, demand draft, or online banking. This tax benefit makes health insurance effectively cheaper — for someone in the 30% tax bracket, a Rs 25,000 premium effectively costs only Rs 17,500 after the tax saving of Rs 7,500.",
  },
  {
    id: "tax_003",
    topic: "Section 10(10D) - Tax-Free Insurance Proceeds",
    category: "tax_benefits",
    content:
      "Section 10(10D) of the Income Tax Act provides tax exemption on the maturity proceeds and death benefits received from a life insurance policy. This means the sum received by the policyholder at maturity or by the nominee on the policyholder's death is generally tax-free. However, there are important conditions: for policies issued after April 2012, the premium paid in any year should not exceed 10% of the sum assured (15% for policies of persons with disability or specified diseases). If this condition is not met, the maturity proceeds become taxable. For ULIPs issued after February 2021, if the annual premium exceeds Rs 2,50,000, the maturity proceeds are taxable as capital gains. Death benefits are always tax-free regardless of the premium-to-sum-assured ratio. For keyman insurance policies, the proceeds are taxable as business income. The tax-free status of insurance proceeds makes life insurance an attractive investment tool from a tax perspective, especially for high-income individuals. However, the primary purpose of insurance should always be protection, with tax benefits being an additional advantage rather than the main reason for purchase.",
  },

  // ── Common FAQs ────────────────────────────────────────────

  {
    id: "faq_001",
    topic: "How Much Life Insurance Coverage Do I Need?",
    category: "faqs",
    content:
      "Determining the right amount of life insurance coverage depends on your individual circumstances. A commonly used guideline is the Human Life Value (HLV) approach, which suggests coverage of 10-15 times your annual income. However, a more precise calculation should consider: your annual income and expected salary growth, outstanding loans and liabilities (home loan, car loan, personal loans), your family's annual living expenses multiplied by the number of years they need support, children's future education and marriage expenses, existing savings and investments that can partially cover these needs, and inflation adjustment. For example, if your annual income is Rs 10 lakh, annual family expenses are Rs 6 lakh, you have a home loan of Rs 40 lakh, and your children's education goal is Rs 30 lakh, your required coverage could be approximately Rs 1.5-2 crore. As a minimum starting point, ensure your coverage is at least 10 times your annual income. Review and increase your coverage at major life milestones — marriage, birth of a child, buying a home, or career advancement. As you age and build assets, your insurance need may decrease since your savings can partially replace the coverage.",
  },
  {
    id: "faq_002",
    topic: "What is the Right Age to Buy Insurance?",
    category: "faqs",
    content:
      "The best time to buy insurance is as early as possible, ideally in your 20s when you start earning. For life insurance, buying early has significant advantages: premiums are much lower for younger individuals (a 25-year-old may pay 30-50% less premium than a 35-year-old for the same coverage), you are more likely to be in good health and less likely to face rejection or loading, you build a longer history of coverage which can be beneficial for future claims, and you protect your family earlier. For health insurance, buying early means you start accumulating waiting period benefits sooner, get lower premiums locked in, and build no-claim bonus benefits over time. Even if you are covered under a group health policy from your employer, having an individual policy ensures continuous coverage regardless of employment status. For term insurance, the ideal time is when someone financially depends on you — at marriage, parenthood, or when you take a home loan. For health insurance, buy as soon as you turn 18 or start earning. Waiting to buy insurance until you need it is risky — you may develop health conditions that make insurance expensive or unavailable.",
  },
  {
    id: "faq_003",
    topic: "Can I Have Multiple Insurance Policies?",
    category: "faqs",
    content:
      "Yes, you can have multiple insurance policies of the same or different types. In life insurance, you can hold multiple policies from different insurers. The total coverage should be proportional to your income and financial needs. When filing a death claim, all policies pay independently — there is no adjustment. However, each insurer may check for existing coverage during underwriting to ensure the total coverage is justified by your income level. In health insurance, you can have multiple policies. However, health insurance follows the principle of indemnity — you can only claim the actual expenses incurred, not more. If you have two health policies, you can claim from one insurer first and the balance from the second insurer. You cannot profit from health insurance by claiming the same expense from multiple insurers. In motor insurance, you can only have one policy per vehicle as per IRDAI guidelines. For personal accident insurance, you can hold multiple policies and all of them will pay independently since the benefit is a fixed sum (not indemnity-based). Having multiple policies can be a smart strategy — for example, a base health policy with a super top-up from a different insurer provides cost-effective enhanced coverage.",
  },
  {
    id: "faq_004",
    topic: "What Happens If I Miss a Premium Payment?",
    category: "faqs",
    content:
      "Missing a premium payment does not immediately terminate your policy — you get a grace period. For life insurance, the grace period is 15 days for monthly premium policies and 30 days for other modes. During the grace period, the policy remains fully active and claims can be made. If the premium is still not paid after the grace period, the policy lapses. A lapsed life insurance policy can usually be revived within 2-5 years by paying all overdue premiums with interest and possibly undergoing a fresh medical examination. For health insurance, if the premium is not paid within the grace period, the policy lapses and you lose accumulated waiting period benefits, no-claim bonus, and continuous coverage history. Some insurers may allow renewal within 30 days of expiry with a break-in-coverage clause. For motor insurance, if the policy expires without renewal, there is a break in insurance. If renewed within 90 days, you may retain your NCB (at some insurers' discretion), but if the break exceeds 90 days, NCB is lost. Driving without valid insurance is illegal and can result in penalties. To avoid missed payments, set up auto-debit or standing instructions with your bank.",
  },
  {
    id: "faq_005",
    topic: "How Does Nomination Work in Insurance?",
    category: "faqs",
    content:
      "Nomination in insurance is the process of designating a person (nominee) who will receive the policy benefits in case of the policyholder's death. Under Section 39 of the Insurance Act, 1938, every life insurance policyholder has the right to nominate one or more persons. Key aspects: The nominee acts as a custodian of the policy proceeds, holding them in trust for the legal heirs. The nominee is not necessarily the ultimate beneficiary — legal heirs can claim the proceeds from the nominee. Multiple nominees can be appointed with specified percentage shares (e.g., 50% to spouse and 25% each to two children). The nomination can be changed at any time during the policy term by informing the insurer in writing. Minor nominees must have an appointee (an adult) designated to receive the proceeds until the minor attains majority. In health insurance, nomination is relevant for the death benefit component of a personal accident cover. For motor insurance, the registered owner is the policyholder and beneficiary. It is crucial to keep your nomination updated, especially after life events like marriage, birth of a child, or death of the original nominee.",
  },
  {
    id: "faq_006",
    topic: "What is Health Insurance Portability?",
    category: "faqs",
    content:
      "Health insurance portability allows you to switch your health insurance policy from one insurer to another without losing the benefits you have accumulated. The IRDAI introduced portability guidelines in 2011 to empower policyholders and promote competition. Key benefits of portability: your waiting period credits are transferred (if you have completed 2 years of the 4-year pre-existing disease waiting period with the old insurer, you only need to serve the remaining 2 years with the new insurer), no-claim bonus benefits may be carried forward, and continuous coverage history is maintained. To port a policy: apply to the new insurer at least 45 days before the existing policy's renewal date, the new insurer will evaluate your proposal and may accept, reject, or offer modified terms, and if accepted, the new policy starts from the date the old policy was due for renewal. Important considerations: portability is not automatic — the new insurer can change terms or coverage; you can port to a different plan type (individual to floater or vice versa); the sum insured in the new policy can be equal to or higher than the old policy; and portability does not mean guaranteed acceptance — the new insurer conducts its own underwriting.",
  },
  {
    id: "faq_007",
    topic: "Insurance for Senior Citizens",
    category: "faqs",
    content:
      "Insurance needs and options change significantly for senior citizens (aged 60 and above). Health insurance becomes most critical — medical expenses increase with age, and hospitalization is more likely. Many insurers offer specialized senior citizen health plans with features like coverage up to age 80-99, higher sum insured options, domiciliary treatment cover, and wellness programs. However, senior citizen policies typically have higher premiums (2-4 times that of a younger person), mandatory co-payment clauses (usually 10-20%), and longer waiting periods for pre-existing conditions. Life insurance options become limited after 60 as most term plans have entry age limits of 60-65. If you already have a term policy, it continues as long as premiums are paid. For those without life insurance, some insurers offer whole life or guaranteed plans for seniors with reduced coverage. Personal accident insurance is relatively easier to get and important given the higher risk of falls and accidents in older age. Key recommendations for seniors: do not let your existing health policy lapse (re-buying will be expensive and you lose waiting period benefits), consider a super top-up to enhance coverage at a lower cost, explore critical illness plans, and keep all medical records organized for smooth claim processing.",
  },
  {
    id: "faq_008",
    topic: "Understanding Insurance Renewals",
    category: "faqs",
    content:
      "Insurance renewal is the process of continuing your policy coverage by paying the premium before or at the expiry of the current policy term. Timely renewal is crucial to maintain uninterrupted coverage. In health insurance, renewal is typically annual. Benefits of timely renewal include maintaining accumulated waiting period credits, retaining no-claim bonus, ensuring continuous coverage without a break, and avoiding re-underwriting or premium loading for new health conditions. If you let your health policy lapse and buy a new one, you restart all waiting periods. In motor insurance, renewal must be done before the policy expiry date. Most insurers send reminders 30-45 days before expiry. If renewal is done within 90 days of expiry, you may retain NCB at some insurers' discretion. Beyond 90 days, NCB is lost and you may need a fresh vehicle inspection. Life insurance policies with regular premiums have a grace period for renewal. Auto-renewal via standing instructions is the best way to ensure you never miss a renewal. When renewing, compare options — you are not obligated to renew with the same insurer. Portability allows you to switch while retaining benefits. Also review your coverage adequacy at each renewal — inflation may have made your existing sum insured insufficient.",
  },
];
