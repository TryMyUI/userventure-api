import { Column, Table, Model } from 'sequelize-typescript';

@Table({
  tableName: 'matomo_user',
  defaultScope: { attributes: { exclude: ['password'] } },
})
export class MatomoUser extends Model {
  @Column({ type: 'varchar(100)', allowNull: false, primaryKey: true })
  login: string;

  @Column({ type: 'varchar(100)', allowNull: false })
  email: string;

  @Column({ type: 'varchar(40)', allowNull: false, defaultValue: '' })
  twofactor_secret: string;

  @Column({ type: 'varchar(255)', allowNull: false })
  password: string;

  @Column({ type: 'tinyint unsigned', allowNull: false })
  superuser_access: number;

  @Column({ type: 'timestamp', allowNull: true })
  date_registered?: Date;

  @Column({ type: 'timestamp', allowNull: true })
  ts_password_modified?: Date;

  @Column({ type: 'int unsigned', allowNull: true })
  idchange_last_viewed?: number;

  @Column({ type: 'varchar(191)', allowNull: true })
  invite_token?: string;

  @Column({ type: 'varchar(100)', allowNull: true })
  invited_by?: string;

  @Column({ type: 'timestamp', allowNull: true })
  invite_expired_at?: Date;

  @Column({ type: 'timestamp', allowNull: true })
  invite_accept_at?: Date;
}
