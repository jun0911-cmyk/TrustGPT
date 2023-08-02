// mysql users 테이블 생성

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(300),
            allowNull: false,
        }
    }, {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
    })
}
    