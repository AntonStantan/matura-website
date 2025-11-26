import numpy as np

# Tokenizer function from the GitHub repository
def tokenizer(input_list):
    """
    Tokenizer for arithmetic expressions.
    Converts expressions like "1 + 2 - 3" into numerical arrays.
    """
    tokenized_x = [expression.split(" ") for expression in input_list]
    
    for i in range(len(tokenized_x)):
        for j in range(len(tokenized_x[i])):
            if j % 2 == 0:  # Even index: number
                tokenized_x[i][j] = np.float32(tokenized_x[i][j])
            else:  # Odd index: operator
                if tokenized_x[i][j] == "+":
                    tokenized_x[i][j] = np.float32(1)
                elif tokenized_x[i][j] == "-":
                    tokenized_x[i][j] = np.float32(0)
                else:
                    raise ValueError(f"Unknown operator: {tokenized_x[i][j]}")
        
        # Add padding to make all inputs length 15
        padding_count = 15 - len(tokenized_x[i])
        for _ in range(padding_count):
            tokenized_x[i].append(np.float32(0.5))
    
    tokenized_x = np.array(tokenized_x)
    return tokenized_x
