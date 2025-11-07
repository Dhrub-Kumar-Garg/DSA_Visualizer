#ifndef GRAPH_H
#define GRAPH_H

#define MAX_NODES 100

typedef struct GraphNode {
    int vertex;
    struct GraphNode* next;
} GraphNode;

typedef struct Graph {
    int numVertices;
    GraphNode** adjLists;
    int* visited;
} Graph;

GraphNode* createGraphNode(int v);
Graph* createGraph(int vertices);
void addEdge(Graph* graph, int src, int dest);
void graphToJson(Graph* graph, char* json);
void DFS(Graph* graph, int vertex, char* result, int* index);
void BFS(Graph* graph, int startVertex, char* result, int* index);

#endif