import * as migration_20250120_121344_initial from './20250120_121344_initial';
import * as migration_20250120_142218_change_products_name from './20250120_142218_change_products_name';
import * as migration_20250120_143916_change_products_name_type from './20250120_143916_change_products_name_type';
import * as migration_20250121_165628 from './20250121_165628';
import * as migration_20250121_171503 from './20250121_171503';
import * as migration_20250121_184438 from './20250121_184438';

export const migrations = [
  {
    up: migration_20250120_121344_initial.up,
    down: migration_20250120_121344_initial.down,
    name: '20250120_121344_initial',
  },
  {
    up: migration_20250120_142218_change_products_name.up,
    down: migration_20250120_142218_change_products_name.down,
    name: '20250120_142218_change_products_name',
  },
  {
    up: migration_20250120_143916_change_products_name_type.up,
    down: migration_20250120_143916_change_products_name_type.down,
    name: '20250120_143916_change_products_name_type',
  },
  {
    up: migration_20250121_165628.up,
    down: migration_20250121_165628.down,
    name: '20250121_165628',
  },
  {
    up: migration_20250121_171503.up,
    down: migration_20250121_171503.down,
    name: '20250121_171503',
  },
  {
    up: migration_20250121_184438.up,
    down: migration_20250121_184438.down,
    name: '20250121_184438'
  },
];
