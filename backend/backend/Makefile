CC = gcc
CFLAGS = -Wall -Wextra -std=c99
TERMINAL_OBJ = visualizer.o tree.o graph.o

all: terminal

terminal: $(TERMINAL_OBJ)
	$(CC) $(CFLAGS) -o terminal $(TERMINAL_OBJ)

tree.o: tree.c tree.h
	$(CC) $(CFLAGS) -c tree.c

graph.o: graph.c graph.h
	$(CC) $(CFLAGS) -c graph.c

visualizer.o: ../terminal/visualizer.c tree.h graph.h
	$(CC) $(CFLAGS) -c ../terminal/visualizer.c -o visualizer.o

clean:
	rm -f terminal *.o

.PHONY: all clean