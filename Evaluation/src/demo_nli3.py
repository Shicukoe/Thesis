"""Check whether nli_sp already penalises NEUTRAL (extra, non-contradicting) content
as hard as CONTRADICTION. Scores three context->claim pairs with AlignScore-base.

  entailment : claim is stated in the context      -> should be HIGH
  neutral    : claim is EXTRA (not in context)      -> is it LOW like contradiction?
  contradict : claim conflicts with the context     -> should be LOW
"""
from __future__ import annotations
from alignscore import AlignScore

CKPT = "D:/Coding_Stuffs/Thesis/Evaluation/.models/AlignScore-base.ckpt"

PAIRS = [
    ("entailment (claim is in context)",
     "The page must include a contact form with name, email, and message fields.",
     "The page has a contact form."),
    ("neutral (claim is EXTRA, not in context)",
     "The page must include a contact form with name, email, and message fields.",
     "Implement OAuth login with Google and GitHub."),
    ("contradiction (claim conflicts)",
     "A navigation label starting with H must have a blue background.",
     "A navigation label starting with H must have a red background."),
]

s = AlignScore(model="roberta-base", batch_size=32, device="cpu",
               ckpt_path=CKPT, evaluation_mode="nli_sp")
for label, ctx, claim in PAIRS:
    score = s.score(contexts=[ctx], claims=[claim])[0]
    print(f"  {score:.4f}  {label}")
