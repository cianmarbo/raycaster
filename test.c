#define WIN_WIDTH 800
#define WIN_HEIGHT 600
#define STRIDE 4

#define BUFFER_SIZE (WIN_HEIGHT * WIN_WIDTH * STRIDE)

#include <stdio.h>
#include <stdlib.h>

uint32_t* buffer;

bool setup() {

    buffer = (uint32_t*)malloc(sizeof(uint32_t) * WIN_WIDTH * WIN_HEIGHT);

    if(!buffer) {
        return false;
    }

    return true;
}

void draw_point(int pos_x, int pos_y) {
    buffer[(WIN_WIDTH * pos_y) + pos_x] = 0xcafebb;
}

void rect(int pos_x, int pos_y, int width, int height) {
    for(int y = pos_y; y < (pos_y + height); y++) {
        for(int x = pos_x; x < (pos_x + width); x++) {
            buffer[(WIN_WIDTH * y) + x] = 0xffffffff;
        }
    }
}

rect(400, 300, 1, 30);

void clear_buffer() {

    for(int i = 0; i < WIN_HEIGHT; i++) {
        for(int j = 0; j < WIN_WIDTH; j+=STRIDE) {
            buffer[(WIN_WIDTH * i) + j] = 0x00ffffff;
        }
    }
}

void dump_buffer() {

    for(int i = 0; i < BUFFER_SIZE; i++) {
        printf("%d", buffer[i]);
    }
}

int main() {

    if(setup()) {
        clear_buffer();
        dump_buffer();
    }

    return 0;
}