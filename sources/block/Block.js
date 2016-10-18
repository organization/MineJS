/* global minejs */

class Block {
    static get AIR() {
        return 0;
    }
    static get STONE() {
        return 1;
    }
    static get GRASS() {
        return 2;
    }
    static get DIRT() {
        return 3;
    }
    static get COBBLESTONE() {
        return 4;
    }
    static get COBBLE() {
        return 4;
    }
    static get PLANK() {
        return 5;
    }
    static get PLANKS() {
        return 5;
    }
    static get WOODEN_PLANK() {
        return 5;
    }
    static get WOODEN_PLANKS() {
        return 5;
    }
    static get SAPLING() {
        return 6;
    }
    static get SAPLINGS() {
        return 6;
    }
    static get BEDROCK() {
        return 7;
    }
    static get WATER() {
        return 8;
    }
    static get STILL_WATER() {
        return 9;
    }
    static get LAVA() {
        return 10;
    }
    static get STILL_LAVA() {
        return 11;
    }
    static get SAND() {
        return 12;
    }
    static get GRAVEL() {
        return 13;
    }
    static get GOLD_ORE() {
        return 14;
    }
    static get IRON_ORE() {
        return 15;
    }
    static get COAL_ORE() {
        return 16;
    }
    static get LOG() {
        return 17;
    }
    static get WOOD() {
        return 17;
    }
    static get TRUNK() {
        return 17;
    }
    static get LEAVES() {
        return 18;
    }
    static get LEAVE() {
        return 18;
    }
    static get SPONGE() {
        return 19;
    }
    static get GLASS() {
        return 20;
    }
    static get LAPIS_ORE() {
        return 21;
    }
    static get LAPIS_BLOCK() {
        return 22;
    }

    static get DISPENSER() {
        return 23;
    }

    static get SANDSTONE() {
        return 24;
    }
    static get NOTEBLOCK() {
        return 25;
    }
    static get BED_BLOCK() {
        return 26;
    }
    static get POWERED_RAIL() {
        return 27;
    }
    static get DETECTOR_RAIL() {
        return 28;
    }

    static get COBWEB() {
        return 30;
    }
    static get TALL_GRASS() {
        return 31;
    }
    static get BUSH() {
        return 32;
    }
    static get DEAD_BUSH() {
        return 32;
    }
    static get WOOL() {
        return 35;
    }
    static get DANDELION() {
        return 37;
    }
    static get POPPY() {
        return 38;
    }
    static get ROSE() {
        return 38;
    }
    static get FLOWER() {
        return 38;
    }
    static get RED_FLOWER() {
        return 38;
    }
    static get BROWN_MUSHROOM() {
        return 39;
    }
    static get RED_MUSHROOM() {
        return 40;
    }
    static get GOLD_BLOCK() {
        return 41;
    }
    static get IRON_BLOCK() {
        return 42;
    }
    static get DOUBLE_SLAB() {
        return 43;
    }
    static get DOUBLE_SLABS() {
        return 43;
    }
    static get SLAB() {
        return 44;
    }
    static get SLABS() {
        return 44;
    }
    static get BRICKS() {
        return 45;
    }
    static get BRICKS_BLOCK() {
        return 45;
    }
    static get TNT() {
        return 46;
    }
    static get BOOKSHELF() {
        return 47;
    }
    static get MOSS_STONE() {
        return 48;
    }
    static get MOSSY_STONE() {
        return 48;
    }
    static get OBSIDIAN() {
        return 49;
    }
    static get TORCH() {
        return 50;
    }
    static get FIRE() {
        return 51;
    }
    static get MONSTER_SPAWNER() {
        return 52;
    }
    static get WOOD_STAIRS() {
        return 53;
    }
    static get WOODEN_STAIRS() {
        return 53;
    }
    static get OAK_WOOD_STAIRS() {
        return 53;
    }
    static get OAK_WOODEN_STAIRS() {
        return 53;
    }
    static get CHEST() {
        return 54;
    }
    static get REDSTONE_WIRE() {
        return 55;
    }
    static get DIAMOND_ORE() {
        return 56;
    }
    static get DIAMOND_BLOCK() {
        return 57;
    }
    static get CRAFTING_TABLE() {
        return 58;
    }
    static get WORKBENCH() {
        return 58;
    }
    static get WHEAT_BLOCK() {
        return 59;
    }
    static get FARMLAND() {
        return 60;
    }
    static get FURNACE() {
        return 61;
    }
    static get BURNING_FURNACE() {
        return 62;
    }
    static get LIT_FURNACE() {
        return 62;
    }
    static get SIGN_POST() {
        return 63;
    }
    static get DOOR_BLOCK() {
        return 64;
    }
    static get WOODEN_DOOR_BLOCK() {
        return 64;
    }
    static get WOOD_DOOR_BLOCK() {
        return 64;
    }
    static get LADDER() {
        return 65;
    }
    static get RAIL() {
        return 66;
    }
    static get COBBLE_STAIRS() {
        return 67;
    }
    static get COBBLESTONE_STAIRS() {
        return 67;
    }
    static get WALL_SIGN() {
        return 68;
    }
    static get LEVER() {
        return 69;
    }
    static get STONE_PRESSURE_PLATE() {
        return 70;
    }
    static get IRON_DOOR_BLOCK() {
        return 71;
    }
    static get WOODEN_PRESSURE_PLATE() {
        return 72;
    }
    static get REDSTONE_ORE() {
        return 73;
    }
    static get GLOWING_REDSTONE_ORE() {
        return 74;
    }
    static get LIT_REDSTONE_ORE() {
        return 74;
    }

    static get REDSTONE_TORCH() {
        return 76;
    }

    static get SNOW() {
        return 78;
    }
    static get SNOW_LAYER() {
        return 78;
    }
    static get ICE() {
        return 79;
    }
    static get SNOW_BLOCK() {
        return 80;
    }
    static get CACTUS() {
        return 81;
    }
    static get CLAY_BLOCK() {
        return 82;
    }
    static get REEDS() {
        return 83;
    }
    static get SUGARCANE_BLOCK() {
        return 83;
    }

    static get FENCE() {
        return 85;
    }
    static get PUMPKIN() {
        return 86;
    }
    static get NETHERRACK() {
        return 87;
    }
    static get SOUL_SAND() {
        return 88;
    }
    static get GLOWSTONE() {
        return 89;
    }
    static get GLOWSTONE_BLOCK() {
        return 89;
    }
    static get NETHER_PORTAL() {
        return 90;
    }
    static get LIT_PUMPKIN() {
        return 91;
    }
    static get JACK_O_LANTERN() {
        return 91;
    }
    static get CAKE_BLOCK() {
        return 92;
    }

    static get INVISIBLE_BEDROCK() {
        return 95;
    }
    static get TRAPDOOR() {
        return 96;
    }

    static get STONE_BRICKS() {
        return 98;
    }
    static get STONE_BRICK() {
        return 98;
    }

    static get BROWN_MUSHROOM_BLOCK() {
        return 99;
    }
    static get RED_MUSHROOM_BLOCK() {
        return 100;
    }

    static get IRON_BAR() {
        return 101;
    }
    static get IRON_BARS() {
        return 101;
    }
    static get GLASS_PANE() {
        return 102;
    }
    static get GLASS_PANEL() {
        return 102;
    }
    static get MELON_BLOCK() {
        return 103;
    }
    static get PUMPKIN_STEM() {
        return 104;
    }
    static get MELON_STEM() {
        return 105;
    }
    static get VINE() {
        return 106;
    }
    static get VINES() {
        return 106;
    }
    static get FENCE_GATE() {
        return 107;
    }
    static get FENCE_GATE_OAK() {
        return 107;
    }
    static get BRICK_STAIRS() {
        return 108;
    }
    static get STONE_BRICK_STAIRS() {
        return 109;
    }
    static get MYCELIUM() {
        return 110;
    }
    static get WATER_LILY() {
        return 111;
    }
    static get LILY_PAD() {
        return 111;
    }
    static get NETHER_BRICKS() {
        return 112;
    }
    static get NETHER_BRICK_BLOCK() {
        return 112;
    }
    static get NETHER_BRICK_FENCE() {
        return 113;
    }
    static get NETHER_BRICKS_STAIRS() {
        return 114;
    }

    static get ENCHANTING_TABLE() {
        return 116;
    }
    static get ENCHANT_TABLE() {
        return 116;
    }
    static get ENCHANTMENT_TABLE() {
        return 116;
    }
    static get BREWING_STAND_BLOCK() {
        return 117;
    }
    static get BREWING_BLOCK() {
        return 117;
    }
    static get CAULDRON_BLOCK() {
        return 118;
    }
    static get END_PORTAL() {
        return 119;
    }
    static get END_PORTAL_FRAME() {
        return 120;
    }
    static get END_STONE() {
        return 121;
    }

    static get REDSTONE_LAMP() {
        return 123;
    }
    static get LIT_REDSTONE_LAMP() {
        return 124;
    }

    static get ACTIVATOR_RAIL() {
        return 126;
    }

    static get SANDSTONE_STAIRS() {
        return 128;
    }
    static get EMERALD_ORE() {
        return 129;
    }

    static get EMERALD_BLOCK() {
        return 133;
    }
    static get SPRUCE_WOOD_STAIRS() {
        return 134;
    }
    static get SPRUCE_WOODEN_STAIRS() {
        return 134;
    }
    static get BIRCH_WOOD_STAIRS() {
        return 135;
    }
    static get BIRCH_WOODEN_STAIRS() {
        return 135;
    }
    static get JUNGLE_WOOD_STAIRS() {
        return 136;
    }
    static get JUNGLE_WOODEN_STAIRS() {
        return 136;
    }

    static get COBBLE_WALL() {
        return 139;
    }
    static get STONE_WALL() {
        return 139;
    }
    static get COBBLESTONE_WALL() {
        return 139;
    }
    static get FLOWER_POT_BLOCK() {
        return 140;
    }
    static get CARROT_BLOCK() {
        return 141;
    }
    static get POTATO_BLOCK() {
        return 142;
    }

    static get SKULL_BLOCK() {
        return 144;
    }
    static get ANVIL() {
        return 145;
    }
    static get TRAPPED_CHEST() {
        return 146;
    }
    static get LIGHT_WEIGHTED_PRESSURE_PLATE() {
        return 147;
    }
    static get HEAVY_WEIGHTED_PRESSURE_PLATE() {
        return 148;
    }
    static get UNPOWERED_COMPARATOR() {
        return 149;
    }
    static get POWERED_COMPARATOR() {
        return 150;
    }
    static get DAYLIGHT_DETECTOR() {
        return 151;
    }
    static get REDSTONE_BLOCK() {
        return 152;
    }
    static get QUARTZ_ORE() {
        return 153;
    }

    static get HOPPER_BLOCK() {
        return 154;
    }
    static get QUARTZ_BLOCK() {
        return 155;
    }
    static get QUARTZ_STAIRS() {
        return 156;
    }
    static get DOUBLE_WOOD_SLAB() {
        return 157;
    }
    static get DOUBLE_WOODEN_SLAB() {
        return 157;
    }
    static get DOUBLE_WOOD_SLABS() {
        return 157;
    }
    static get DOUBLE_WOODEN_SLABS() {
        return 157;
    }
    static get WOOD_SLAB() {
        return 158;
    }
    static get WOODEN_SLAB() {
        return 158;
    }
    static get WOOD_SLABS() {
        return 158;
    }
    static get WOODEN_SLABS() {
        return 158;
    }
    static get STAINED_CLAY() {
        return 159;
    }
    static get STAINED_HARDENED_CLAY() {
        return 159;
    }

    static get LEAVES2() {
        return 161;
    }
    static get LEAVE2() {
        return 161;
    }
    static get WOOD2() {
        return 162;
    }
    static get TRUNK2() {
        return 162;
    }
    static get LOG2() {
        return 162;
    }
    static get ACACIA_WOOD_STAIRS() {
        return 163;
    }
    static get ACACIA_WOODEN_STAIRS() {
        return 163;
    }
    static get DARK_OAK_WOOD_STAIRS() {
        return 164;
    }
    static get DARK_OAK_WOODEN_STAIRS() {
        return 164;
    }

    static get SLIME_BLOCK() {
        return 165;
    }

    static get IRON_TRAPDOOR() {
        return 167;
    }
    static get HAY_BALE() {
        return 170;
    }
    static get CARPET() {
        return 171;
    }
    static get HARDENED_CLAY() {
        return 172;
    }
    static get COAL_BLOCK() {
        return 173;
    }
    static get PACKED_ICE() {
        return 174;
    }
    static get DOUBLE_PLANT() {
        return 175;
    }

    static get DAYLIGHT_DETECTOR_INVERTED() {
        return 178;
    }

    static get FENCE_GATE_SPRUCE() {
        return 183;
    }
    static get FENCE_GATE_BIRCH() {
        return 184;
    }
    static get FENCE_GATE_JUNGLE() {
        return 185;
    }
    static get FENCE_GATE_DARK_OAK() {
        return 186;
    }
    static get FENCE_GATE_ACACIA() {
        return 187;
    }

    static get SPRUCE_DOOR_BLOCK() {
        return 193;
    }
    static get BIRCH_DOOR_BLOCK() {
        return 194;
    }
    static get JUNGLE_DOOR_BLOCK() {
        return 195;
    }
    static get ACACIA_DOOR_BLOCK() {
        return 196;
    }
    static get DARK_OAK_DOOR_BLOCK() {
        return 197;
    }

    static get GRASS_PATH() {
        return 198;
    }
    static get ITEM_FRAME_BLOCK() {
        return 199;
    }

    static get PODZOL() {
        return 243;
    }
    static get BEETROOT_BLOCK() {
        return 244;
    }
    static get STONECUTTER() {
        return 245;
    }
    static get GLOWING_OBSIDIAN() {
        return 246;
    }
}

minejs.block.Block = Block;
