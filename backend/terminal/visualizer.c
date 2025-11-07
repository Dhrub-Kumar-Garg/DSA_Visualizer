#include <stdio.h>
#include <stdlib.h>
#include "../backend/tree.h"
#include "../backend/graph.h"

void printTreeHelper(TreeNode* root, int space) {
    if (root == NULL) return;
    
    space += 10;
    
    printTreeHelper(root->right, space);
    
    printf("\n");
    for (int i = 10; i < space; i++) printf(" ");
    printf("%d\n", root->data);
    
    printTreeHelper(root->left, space);
}

void printTree(TreeNode* root) {
    if (root == NULL) {
        printf("Tree is empty!\n");
        return;
    }
    printf("\nBinary Search Tree Structure:\n");
    printf("(Root at left, branches going right)\n\n");
    printTreeHelper(root, 0);
    printf("\n");
}

void printGraph(Graph* graph) {
    if (graph == NULL) {
        printf("Graph is empty!\n");
        return;
    }
    
    printf("\nGraph Adjacency List:\n");
    for (int i = 0; i < graph->numVertices; i++) {
        printf("Vertex %d: ", i);
        GraphNode* temp = graph->adjLists[i];
        while (temp) {
            printf("%d -> ", temp->vertex);
            temp = temp->next;
        }
        printf("NULL\n");
    }
    printf("\n");
}
void freeTree(TreeNode* root) {
    if (root == NULL) return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);
}

void freeGraph(Graph* graph) {
    if (graph == NULL) return;
    
    for (int i = 0; i < graph->numVertices; i++) {
        GraphNode* temp = graph->adjLists[i];
        while (temp) {
            GraphNode* to_free = temp;
            temp = temp->next;
            free(to_free);
        }
    }
    free(graph->adjLists);
    free(graph->visited);
    free(graph);
}

int main() {
    int choice;
    TreeNode* current_tree = NULL;
    Graph* current_graph = NULL;
    
    printf("=== DSA Visualizer Terminal ===\n");
    printf("ACCURATE TREE & GRAPH OPERATIONS\n\n");
    
    while (1) {
        printf("1. Build and Display Binary Search Tree\n");
        printf("2. Tree Traversals (Inorder, Preorder, Postorder)\n");
        printf("3. Build and Display Graph\n");
        printf("4. Graph Traversals (DFS, BFS)\n");
        printf("5. Clear Memory\n");
        printf("6. Exit\n");
        printf("Choice: ");
        scanf("%d", &choice);
        
        switch (choice) {
            case 1: {
                // Free previous tree
                if (current_tree != NULL) {
                    freeTree(current_tree);
                    current_tree = NULL;
                }
                
                int n, val;
                printf("Enter number of nodes: ");
                scanf("%d", &n);
                
                if (n <= 0) {
                    printf("Error: Number of nodes must be positive!\n");
                    break;
                }
                
                printf("Enter %d unique values: ", n);
                current_tree = NULL;
                
                for (int i = 0; i < n; i++) {
                    scanf("%d", &val);
                    current_tree = insert(current_tree, val);
                }
                
                printTree(current_tree);
                break;
            }
            
            case 2: {
                if (current_tree == NULL) {
                    printf("Error: Please build a tree first (Option 1)!\n");
                    break;
                }
                
                char result[1000];
                int index;
                
                printf("\n--- TREE TRAVERSALS ---\n");
                
                index = 0;
                inorder(current_tree, result, &index);
                printf("Inorder (Sorted): %s\n", result);
                
                index = 0;
                preorder(current_tree, result, &index);
                printf("Preorder: %s\n", result);
                
                index = 0;
                postorder(current_tree, result, &index);
                printf("Postorder: %s\n", result);
                break;
            }
            
            case 3: {
                // Free previous graph
                if (current_graph != NULL) {
                    freeGraph(current_graph);
                    current_graph = NULL;
                }
                
                int vertices, edges, src, dest;
                printf("Enter number of vertices: ");
                scanf("%d", &vertices);
                
                if (vertices <= 0) {
                    printf("Error: Number of vertices must be positive!\n");
                    break;
                }
                
                printf("Enter number of edges: ");
                scanf("%d", &edges);
                
                if (edges < 0) {
                    printf("Error: Number of edges cannot be negative!\n");
                    break;
                }
                
                current_graph = createGraph(vertices);
                printf("Enter %d edges (source destination): \n", edges);
                
                for (int i = 0; i < edges; i++) {
                    printf("Edge %d: ", i + 1);
                    scanf("%d %d", &src, &dest);
                    
                    if (src < 0 || src >= vertices || dest < 0 || dest >= vertices) {
                        printf("Error: Vertex indices must be between 0 and %d!\n", vertices - 1);
                        i--; // Retry this edge
                        continue;
                    }
                    
                    addEdge(current_graph, src, dest);
                }
                
                printGraph(current_graph);
                break;
            }
            
            case 4: {
                if (current_graph == NULL) {
                    printf("Error: Please build a graph first (Option 3)!\n");
                    break;
                }
                
                int start;
                printf("Enter start vertex for traversal (0 to %d): ", current_graph->numVertices - 1);
                scanf("%d", &start);
                
                if (start < 0 || start >= current_graph->numVertices) {
                    printf("Error: Invalid start vertex!\n");
                    break;
                }
                
                char result[1000];
                int index;
                
                printf("\n--- GRAPH TRAVERSALS ---\n");
                
                // Reset visited array for DFS
                for (int i = 0; i < current_graph->numVertices; i++) {
                    current_graph->visited[i] = 0;
                }
                
                index = 0;
                DFS(current_graph, start, result, &index);
                printf("DFS from vertex %d: %s\n", start, result);
                
                // Reset visited array for BFS
                for (int i = 0; i < current_graph->numVertices; i++) {
                    current_graph->visited[i] = 0;
                }
                
                index = 0;
                BFS(current_graph, start, result, &index);
                printf("BFS from vertex %d: %s\n", start, result);
                break;
            }
            
            case 5: {
                if (current_tree != NULL) {
                    freeTree(current_tree);
                    current_tree = NULL;
                    printf("Tree memory cleared.\n");
                }
                if (current_graph != NULL) {
                    freeGraph(current_graph);
                    current_graph = NULL;
                    printf("Graph memory cleared.\n");
                }
                printf("All memory freed.\n");
                break;
            }
            
            case 6:
                // Cleanup before exit
                if (current_tree != NULL) freeTree(current_tree);
                if (current_graph != NULL) freeGraph(current_graph);
                printf("Exiting... Goodbye!\n");
                exit(0);
                
            default:
                printf("Invalid choice! Please enter 1-6.\n");
        }
        
        printf("\n");
    }
    
    return 0;
}