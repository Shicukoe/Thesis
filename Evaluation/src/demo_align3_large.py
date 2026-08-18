"""Score the 3 demo pairs with AlignScore-large for the report table, using the
metric exactly as released (https://github.com/yuh-zha/AlignScore).

AlignScore = one function ALIGN(context, claim) -> a single [0,1] score. Used
in the canonical direction only: ALIGN(context=ground_truth, claim=candidate)
(is the candidate supported by the ground truth?). One number per pair.
"""
from alignscore import AlignScore

CKPT = "D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-large.ckpt"
PAIRS = [
    ("weather (paraphrase)",
     "The weather is cold today.", "It is freezing today."),
    ("blue vs red (contradiction)",
     "A navigation label starting with H must have a blue background.",
     "A navigation label starting with H must have a red background."),
    ("customer mgmt (real paraphrase)",
     "Implement customer management with create, edit, delete, and browse operations.",
     "Include customer management: Users can create, edit, delete, and browse customers."),
]
s = AlignScore(model="roberta-large", batch_size=32, device="cpu",
               ckpt_path=CKPT, evaluation_mode="nli_sp")
for label, gt, cand in PAIRS:
    # AlignScore = ALIGN(context=ground_truth, claim=candidate), single direction.
    alignscore = s.score(contexts=[gt], claims=[cand])[0]
    print(f"  AlignScore={alignscore:.4f}  {label}")
