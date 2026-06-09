---
layout: post
title: "Machine Learning: K-Nearest Neighbors (KNN) Explained"
description: "A layman's guide to understanding the K-Nearest Neighbors algorithm, complete with Python code."
tags: [Machine Learning, AI, Python, Data Science, Algorithms]
math: true
---

Today we are tackling one of the most classic Machine Learning algorithms out there: K-Nearest Neighbors, or KNN for short. We are going to break this down into plain English so you can actually understand what is happening under the hood.

![Thinking Math](https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif)

## What is KNN?

KNN is an algorithm used for both **Classification** (putting things into categories) and **Regression** (predicting a continuous number). 

At its core, it is incredibly simple: it uses geometric distances to figure out how similar different data points are. 

Here is an interesting fact about KNN that makes it a weirdo in the machine learning world:
Most machine learning models take forever to train, but are lightning fast when you actually run them. **KNN is the exact opposite.** It literally does absolutely nothing during the training phase. It just swallows the data. But when you ask it to make a prediction at runtime, it has to calculate the distance against every single point. 

*   **Training Time:** O(1) (Instant)
*   **Running Time:** O(N) (Slow, because it checks everything)

## The "K" in KNN 

`K` is just a hyperparameter. That is a fancy word for "a setting you have to choose yourself." It represents the amount of neighboring data points the algorithm should look at to make its final decision.

### How do we pick the best K?

You cannot just guess a number. Here are the two best ways to find it:

1.  **K-Fold Cross Validation:** You split your dataset into `K` different chunks. You train the data on some chunks, test it on others, find the accuracy for each test, and average them out. 
2.  **The Elbow Method:** You literally just run the algorithm over and over with different values of `K` and plot the accuracies on a graph. You pick the `K` value where the graph bends like an elbow, giving you the best accuracy without overcomplicating things.

## How Does It Actually Work?

When you give KNN a new, unknown data point, it grabs its tape measure and calculates the distance between your new point and every other point in the entire dataset. It finds the `K` closest points (the nearest neighbors) and makes a decision based on their "weights".

### Calculating Distance

It uses the **Minkowski Formula** to calculate how far apart points are:

$$ d(x, x_{i}) = \left( \sum_{j=1}^{n} |x_{j} - x_{ij}|^{p} \right)^{1/p} $$

![Scary Math](https://i.giphy.com/jUwpNzg9IcyrK.webp)

Don't let the math scare you. By changing the `P` parameter in that formula, you get different types of tape measures:
*   `P = 1`: **Manhattan Distance** (Like driving along city blocks)
*   `P = 2`: **Euclidean Distance** (A straight line from A to B)
*   `P = Infinity`: **Chebyshev Distance**

### Weighting the Neighbors

Not all neighbors are equal. A neighbor that is right next to you should have a louder voice than a neighbor who is barely inside the `K` radius. 

We assign weights to the neighbors based on distance:
*   **Inverse Weights:** $W = \frac{1}{d}$ (The simplest form)
*   **Inverse Square Weights:** $W = \frac{1}{d^2}$
*   **Gaussian Weights:** Pulled by a bell curve with a standard deviation.

*Note: Taking all weights as exactly `1` (treating everyone equally) is usually a terrible idea because you might accidentally let an anomaly group hijack the final vote.* 🧠

![Coding Time](https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif)

## The Python Code 

Here is how you actually build this beast in Python using NumPy.

```python
import numpy as np
import matplotlib.pyplot as plt

class KNN():
    def __init__(self, X, K, Y):
        self.X =  X
        self.K = K 
        self.y = Y # labels
        
    def distance(self, x, p=2): 
        # Minkowski Distance: p=1 -> Manhattan, p=2 -> Euclidean
        if (p == np.inf):
            return np.max(np.abs(x - self.X), axis=1)
        return (np.sum(np.abs(x - self.X)**p, axis=1))**(1/p)

    def predict(self, x, p=2, method="inverse"):
        distances = self.distance(x,p)
        n_i = np.argsort(distances)[:self.K] # Get the nearest neighbor indexes
        distances_k =  distances[n_i] 
        weights = self.weights(distances_k, method=method) 
        classes = self.y[n_i] 
        unique, inverse = np.unique(classes, return_inverse=True)
        votes = np.bincount(inverse, weights=weights)
        return unique[np.argmax(votes)]
    
    def weights(self, distances, method=None):
        if method == "inverse":
            return 1 / (distances + 1e-10)
        elif method == "inverse_square":
            return 1 / (distances + 1e-10)**2
        else:
            return np.ones(distances.shape)

    def plot(self):
        plt.figure(figsize=(8, 6))
        classes = np.unique(self.y)
        for cls in classes:
            mask = self.y == cls
            plt.scatter(self.X[mask, 0], self.X[mask, 1], label=f"Class {cls}")
        plt.xlabel("Feature 1")
        plt.ylabel("Feature 2")
        plt.title(f"KNN Dataset (K={self.K})")
        plt.legend()
        plt.grid(True)
        plt.show()

if __name__ == "__main__":
    X = np.array([[1,2],[2,3],[3,3],[6,7],[7,8],[8,8]])
    y = np.array([0,0,0,1,1,1])
    knn = KNN(X, K=3, Y=y)
    x = np.array([4,4])
    print("Point:", x)
    print("Prediction:", knn.predict(x, p=2, method="inverse")) 
    knn.plot()
```

### Breaking down the code:
1. The `distance()` function uses the general formula so you can swap between Manhattan and Euclidean effortlessly. 🍿
2. The `weights()` function handles giving score values to the neighbors. We represent the classes numerically so the math works.
3. The `predict()` function calculates distances, sorts them, grabs the top `K`, applies the weights, and then returns whichever class got the highest vote. It uses vectorization to be as fast as possible. 

If writing vectorized code feels complicated right now, don't stress. Keep looping, keep learning, and eventually, the fast matrix math will click. 💸

![Victory](https://i.giphy.com/3o6EhGvKschtbrRjX2.webp)
