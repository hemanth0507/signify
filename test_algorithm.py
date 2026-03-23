import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from text_preprocess import simplify_for_sign

def test_algorithm():
    test_cases = [
        {
            "input": "I am eating an apple",
            "expected": "i apple eat",  # Stopwords removed, SOV order
        },
        {
            "input": "She is going to the market",
            "expected": "she market go", # Stopwords removed, SOV order
        },
        {
            "input": "We are playing football in the field",
            "expected": "we football field play", # Heuristic: move verb to end
        },
        {
            "input": "I don't understand the question",
            "expected": "i question understand", # Contraction expanded + reordered
        }
    ]

    print("--- Running Algorithm Verification ---")
    
    all_passed = True
    for case in test_cases:
        actual = simplify_for_sign(case["input"])
        status = "PASS" if actual.lower() == case["expected"].lower() else "FAIL"
        print(f"Input:    \"{case['input']}\"")
        print(f"Expected: \"{case['expected']}\"")
        print(f"Actual:   \"{actual}\"")
        print(f"Status:   {status}")
        print("-" * 30)
        if actual.lower() != case["expected"].lower():
            all_passed = False
            
    if all_passed:
        print("ALL TESTS PASSED!")
    else:
        print("SOME TESTS FAILED. Please check the heuristic logic.")

if __name__ == "__main__":
    test_algorithm()
