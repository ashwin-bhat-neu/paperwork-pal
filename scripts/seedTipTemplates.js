// Written as students would share them. Every seeded tip is one of these,
// so they should stay accurate and general.
export const SEED_TIP_TEMPLATES = [
  {
    process: "OPT",
    title: "Count the 30 days from your DSO recommendation",
    body: "USCIS has to receive your I-765 within 30 days of the date your DSO enters the OPT recommendation in SEVIS. I waited for a reference letter and almost missed it. Have every document ready before you ask for the recommendation.",
  },
  {
    process: "OPT",
    title: "Your unemployment days start on the EAD start date",
    body: "You get 90 days of unemployment on post-completion OPT, and the clock starts on the start date on your card, not when you graduate. I took a long trip after my card arrived and used up a big chunk of them without realizing.",
  },
  {
    process: "OPT",
    title: "Report your employer in the SEVP Portal",
    body: "Once you start working, add your employer in the SEVP Portal and keep it updated if you switch jobs. I assumed HR handled this. They don't.",
  },
  {
    process: "OPT",
    title: "Pick your OPT start date carefully",
    body: "You choose the start date on your application, and it has to fall within 60 days after your program end date. I picked the earliest date to be safe, then my job didn't start for two months, which used up unemployment days.",
  },
  {
    process: "OPT",
    title: "Don't start work before the date on your card",
    body: "A receipt notice or an approval email isn't enough. You can only start working on or after the start date printed on your EAD card.",
  },
  {
    process: "OPT",
    title: "Use a mailing address you'll keep for months",
    body: "USCIS mails the card to the address on your application. I moved right after graduation and my card was sent back. Use an address where you'll still get mail for several months.",
  },
  {
    process: "STEM OPT",
    title: "Check that your employer uses E-Verify before you accept",
    body: "STEM OPT only works with an employer enrolled in E-Verify. My first offer was from a startup that wasn't, and I only found out while filling out the I-983. Ask during the interview process.",
  },
  {
    process: "STEM OPT",
    title: "Apply up to 90 days before your OPT card expires",
    body: "You can file for the STEM extension as early as 90 days before your current EAD ends. Getting the I-983 training plan signed by my manager took three weeks, so start that part first.",
  },
  {
    process: "STEM OPT",
    title: "Put the I-983 evaluations on your calendar",
    body: "You and your employer complete a self-evaluation on the I-983 at 12 months and again at the end. I forgot the 12-month one until my DSO emailed me about it.",
  },
  {
    process: "STEM OPT",
    title: "Confirm your details every six months",
    body: "On STEM OPT you have to confirm your information with your school every six months, even if nothing has changed. It only takes a few minutes, but it's easy to forget.",
  },
  {
    process: "STEM OPT",
    title: "A new job means a new training plan",
    body: "If you change employers during STEM OPT, you need a new I-983 with the new employer, and your DSO needs it within 10 days of starting. I almost started without one.",
  },
  {
    process: "I-20 and travel",
    title: "Check your travel signature date before booking flights",
    body: "A travel signature is usually good for 12 months while you're studying, but only 6 months once you're on OPT. Mine had expired by the time I flew home for winter break, and I had to get a rushed one from my DSO over email.",
  },
  {
    process: "I-20 and travel",
    title: "Carry your latest I-20 and proof of your job",
    body: "Bring your most recent I-20 with a valid travel signature. On OPT, also bring your EAD card and a job letter. The officer asked for my job letter when I came back.",
  },
  {
    process: "I-20 and travel",
    title: "Ask for an I-20 extension before your end date",
    body: "If you need more time to finish your degree, your DSO has to extend your I-20 before the program end date. Once that date passes, it's much harder to fix.",
  },
  {
    process: "I-20 and travel",
    title: "Talk to your DSO before changing programs",
    body: "Changing majors or degree level usually means a new I-20. Tell your DSO before you switch, not after.",
  },
  {
    process: "I-20 and travel",
    title: "Keep a scan of every I-20 you've had",
    body: "You may be asked for your full I-20 history later, for example in a future visa application. I had to dig through old emails to find mine, so scan each one when you get it.",
  },
  {
    process: "Taxes",
    title: "File Form 8843 even with no income",
    body: "F-1 students who are nonresidents for tax purposes file Form 8843 every year, even with no US income at all. I didn't know this my first year and had to file it late.",
  },
  {
    process: "Taxes",
    title: "Don't use regular tax software as a nonresident",
    body: "Most popular tax software is built for residents. I filed with one my first year, claimed deductions I wasn't allowed, and had to file an amended return. Check whether your school offers a nonresident tax tool for free.",
  },
  {
    process: "Taxes",
    title: "Check your pay stub for Social Security and Medicare",
    body: "Most F-1 students who are nonresidents for tax purposes don't owe Social Security and Medicare taxes. My on-campus job withheld them anyway. I got the money back by asking payroll, but it took months, so check your first pay stub.",
  },
  {
    process: "Taxes",
    title: "See whether a tax treaty applies to you",
    body: "Some countries have tax treaties with the US that can lower the tax on student wages or scholarships. I didn't claim mine my first year and paid more than I needed to.",
  },
  {
    process: "Taxes",
    title: "Nonresidents usually file the 1040-NR",
    body: "As a nonresident you usually file Form 1040-NR, not the regular 1040. Filing the wrong one is a common mistake, and fixing it means an amended return.",
  },
  {
    process: "Taxes",
    title: "Your state return is separate",
    body: "Filing your federal return doesn't cover your state. If you worked in a state with income tax, you probably need to file a state return too.",
  },
  {
    process: "Visa",
    title:
      "An expired visa doesn't end your status, but you can't re-enter on it",
    body: "My visa stamp expired while I was still in school, and I panicked. Your status depends on your I-20, not the stamp, so you can stay. But you need a valid visa to come back after traveling abroad, so plan renewals early.",
  },
  {
    process: "Visa",
    title: "Book your visa appointment as early as you can",
    body: "Wait times vary a lot by consulate and season. I booked three months out and still barely made it back before classes started.",
  },
  {
    process: "Visa",
    title: "Have your funding documents ready",
    body: "At my interview they asked how I'd pay for school and what I planned to do after graduating. Bring your financial documents and have a short, honest answer ready.",
  },
  {
    process: "Visa",
    title: "Leave room for extra review after the interview",
    body: "Some applicants get extra review after the interview that can take weeks. Don't book a non-refundable flight for the day after your appointment.",
  },
  {
    process: "Visa",
    title: "Your visa and your status are different things",
    body: "The visa stamp is for entering the US. Your status is what lets you stay. Understanding the difference saved me a lot of stress.",
  },
  {
    process: "Other",
    title: "Report a new address within 10 days",
    body: "When you move, you have 10 days to update your address with your school, or in the SEVP Portal on OPT. I moved apartments in the middle of finals and forgot until a month later.",
  },
  {
    process: "Other",
    title: "Keep copies of everything you file",
    body: "Save receipt notices, approval notices, and a copy of every form you send. I needed an old receipt notice two years later.",
  },
  {
    process: "Other",
    title: "Ask your DSO early",
    body: "DSOs would much rather answer a question early than fix a problem later. Emailing mine before I was stuck saved me twice.",
  },
  {
    process: "Other",
    title: "Apply for a Social Security number once you have a job",
    body: "You generally need a job offer or work authorization before you can apply. Bring your offer letter, I-20, and passport to the appointment.",
  },
  {
    process: "Other",
    title: "Hang up on calls demanding payment",
    body: "Callers pretending to be immigration or tax officials sometimes target international students. Real agencies don't demand payment by gift card or wire transfer over the phone.",
  },
];
