#ifndef TREE_H
#define TREE_H

typedef struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

TreeNode* createTreeNode(int data);
TreeNode* insert(TreeNode* root, int data);
void freeTree(TreeNode* root);
void inorder(TreeNode* root, char* result, int* index);
void preorder(TreeNode* root, char* result, int* index);
void postorder(TreeNode* root, char* result, int* index);
void treeToJson(TreeNode* root, char* json, int* index);

#endif