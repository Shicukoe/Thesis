"""Score the 3 demo pairs with AlignScore-LARGE (both directions) for the report table."""
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
    p = s.score(contexts=[gt], claims=[cand])[0]
    r = s.score(contexts=[cand], claims=[gt])[0]
    print(f"  P={p:.4f} R={r:.4f}  {label}")
