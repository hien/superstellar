// ********** TEXTURES **********
export const BACKGROUND_TEXTURE = "images/background1.png";
export const SHIP_TEXTURE = "images/ship.png";

// ********** SPRITESHEETS **********
export const FLAME_SPRITESHEET = "spritesheets/flame_yellow.json";
export const FLAME_SPRITESHEET_FRAME_NAMES = [0, 1, 2, 3].map((i) => `thrust_yellow_${i}.png`);

export const PROJECTILE_SPRITESHEET = "spritesheets/projectile.json";
export const PROJECTILE_SPRITESHEET_FRAME_NAMES = [1, 2, 3].map((i) => `bullet${i}.png`);

// ********** PROTOBUFS **********
export const PROTOBUF_DEFINITION      = "js/superstellar_proto.json";
export const SPACE_DEFINITION         = "superstellar.Space";
export const USER_INPUT_DEFINITION    = "superstellar.UserInput";
export const USER_MESSAGE_DEFINITION  = "superstellar.UserMessage";
export const PLAYER_LEFT_DEFINITION   = "superstellar.PlayerLeft";
export const SHOT_DEFINITION          = "superstellar.Shot";
export const MESSAGE_DEFINITION       = "superstellar.Message";

export const HELLO_MESSAGE       = "hello";
export const SPACE_MESSAGE       = "space";
export const PLAYER_LEFT_MESSAGE = "playerLeft";
export const PROJECTILE_FIRED_MESSAGE  = "projectileFired";