import { queryAll, queryOne } from '../database/connection.js';
import { BusinessRule } from '../types/index.js';

interface RawRuleRow {
  id: string;
  rule_name: string;
  rule_category: string;
  parameter: string;
  value: string;
  description: string;
  priority: number;
  active: number;
}

function mapRowToRule(row: RawRuleRow): BusinessRule {
  return {
    id: row.id,
    rule_name: row.rule_name,
    rule_category: row.rule_category,
    parameter: row.parameter,
    value: row.value,
    description: row.description,
    priority: row.priority,
    active: row.active === 1
  };
}

export class BusinessRuleRepository {
  public static getAllActive(): BusinessRule[] {
    const rows = queryAll<RawRuleRow>(
      'SELECT * FROM business_rules WHERE active = 1 ORDER BY priority ASC'
    );
    return rows.map(mapRowToRule);
  }

  public static getByCategory(category: string): BusinessRule[] {
    const rows = queryAll<RawRuleRow>(
      'SELECT * FROM business_rules WHERE active = 1 AND rule_category = ? ORDER BY priority ASC',
      [category]
    );
    return rows.map(mapRowToRule);
  }

  public static getByParameter(parameter: string): BusinessRule | null {
    const row = queryOne<RawRuleRow>(
      'SELECT * FROM business_rules WHERE parameter = ? AND active = 1',
      [parameter]
    );
    return row ? mapRowToRule(row) : null;
  }
}
