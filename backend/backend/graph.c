#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "graph.h"

GraphNode* createGraphNode(int v) {
    GraphNode* newNode = (GraphNode*)malloc(sizeof(GraphNode));
    newNode->vertex = v;
    newNode->next = NULL;
    return newNode;
}

Graph* createGraph(int vertices) {
    Graph* graph = (Graph*)malloc(sizeof(Graph));
    graph->numVertices = vertices;
    graph->adjLists = (GraphNode**)malloc(vertices * sizeof(GraphNode*));
    graph->visited = (int*)malloc(vertices * sizeof(int));

    for (int i = 0; i < vertices; i++) {
        graph->adjLists[i] = NULL;
        graph->visited[i] = 0;
    }
    return graph;
}

void addEdge(Graph* graph, int src, int dest) {
    // Add edge from src to dest
    GraphNode* newNode = createGraphNode(dest);
    newNode->next = graph->adjLists[src];
    graph->adjLists[src] = newNode;

    // Add edge from dest to src (undirected)
    newNode = createGraphNode(src);
    newNode->next = graph->adjLists[dest];
    graph->adjLists[dest] = newNode;
}

void graphToJson(Graph* graph, char* json) {
    int index = 0;
    index += sprintf(json + index, "{\"nodes\":[");
    
    // Add nodes
    for (int i = 0; i < graph->numVertices; i++) {
        index += sprintf(json + index, "{\"id\":%d,\"label\":\"%d\"}", i, i);
        if (i < graph->numVertices - 1) index += sprintf(json + index, ",");
    }
    
    index += sprintf(json + index, "],\"edges\":[");
    
    // Add edges (avoid duplicates for undirected graph)
    int edgeCount = 0;
    for (int i = 0; i < graph->numVertices; i++) {
        GraphNode* temp = graph->adjLists[i];
        while (temp) {
            if (i < temp->vertex) { // Add edge only once for undirected
                if (edgeCount > 0) index += sprintf(json + index, ",");
                index += sprintf(json + index, "{\"from\":%d,\"to\":%d}", i, temp->vertex);
                edgeCount++;
            }
            temp = temp->next;
        }
    }
    
    index += sprintf(json + index, "]}");
}

void DFS(Graph* graph, int vertex, char* result, int* index) {
    graph->visited[vertex] = 1;
    *index += sprintf(result + *index, "%d ", vertex);

    GraphNode* adjList = graph->adjLists[vertex];
    GraphNode* temp = adjList;

    while (temp != NULL) {
        int connectedVertex = temp->vertex;
        if (!graph->visited[connectedVertex]) {
            DFS(graph, connectedVertex, result, index);
        }
        temp = temp->next;
    }
}

void BFS(Graph* graph, int startVertex, char* result, int* index) {
    int queue[MAX_NODES];
    int front = 0, rear = 0;

    for (int i = 0; i < graph->numVertices; i++) {
        graph->visited[i] = 0;
    }

    graph->visited[startVertex] = 1;
    queue[rear++] = startVertex;

    while (front < rear) {
        int currentVertex = queue[front++];
        *index += sprintf(result + *index, "%d ", currentVertex);

        GraphNode* temp = graph->adjLists[currentVertex];
        while (temp) {
            int adjVertex = temp->vertex;
            if (!graph->visited[adjVertex]) {
                graph->visited[adjVertex] = 1;
                queue[rear++] = adjVertex;
            }
            temp = temp->next;
        }
    }
}