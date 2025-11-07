#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "tree.h"

TreeNode* createTreeNode(int data) {
    TreeNode* newNode = (TreeNode*)malloc(sizeof(TreeNode));
    newNode->data = data;
    newNode->left = newNode->right = NULL;
    return newNode;
}

TreeNode* insert(TreeNode* root, int data) {
    if (root == NULL) return createTreeNode(data);
    
    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    
    return root;
}

void inorder(TreeNode* root, char* result, int* index) {
    if (root == NULL) return;
    inorder(root->left, result, index);
    *index += sprintf(result + *index, "%d ", root->data);
    inorder(root->right, result, index);
}

void preorder(TreeNode* root, char* result, int* index) {
    if (root == NULL) return;
    *index += sprintf(result + *index, "%d ", root->data);
    preorder(root->left, result, index);
    preorder(root->right, result, index);
}

void postorder(TreeNode* root, char* result, int* index) {
    if (root == NULL) return;
    postorder(root->left, result, index);
    postorder(root->right, result, index);
    *index += sprintf(result + *index, "%d ", root->data);
}

void treeToJson(TreeNode* root, char* json, int* index) {
    if (root == NULL) {
        *index += sprintf(json + *index, "null");
        return;
    }
    
    *index += sprintf(json + *index, "{\"data\":%d,\"left\":", root->data);
    treeToJson(root->left, json, index);
    *index += sprintf(json + *index, ",\"right\":");
    treeToJson(root->right, json, index);
    *index += sprintf(json + *index, "}");
}
void freeTree(TreeNode* root) {
    if (root == NULL) return;
    freeTree(root->left);
    freeTree(root->right);
    free(root);
}