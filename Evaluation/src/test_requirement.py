"""Self-check for requirement-level aggregation (no model needed - mocks BERTScore).
Run: py src/test_requirement.py
"""
import textual_fidelity as tf

# fake BERTScore: 1.0 if the two units are identical, else 0.0
tf.bert_prf = lambda cands, refs, model_key=None: [
    {"bertscore_f1": 1.0 if c == r else 0.0} for c, r in zip(cands, refs)
]

# reference units = [A, C], candidate units = [A, B]
#   S = [[1,0],   (A vs A,B)
#        [0,0]]   (C vs A,B)
#   recall    = mean(max[1,0], max[0,0]) = mean(1,0) = 0.5   (C dropped)
#   precision = mean(A->max[1,0]=1, B->max[0,0]=0) = 0.5     (B fabricated)
r = tf.requirement_prf("A. B.", "A. C.")
assert r["bertscore_recall"] == 0.5, r
assert r["bertscore_precision"] == 0.5, r
assert r["dropped"][0][0] == "C.", r         # C is the dropped reference unit
assert r["fabricated"][0][0] == "B.", r      # B is the fabricated candidate unit
print("ok - requirement-level aggregation correct")
