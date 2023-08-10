// mysql votes 테이블 생성

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("vote", {
        idx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        link: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        vote_cnt: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        voter: {
            type: DataTypes.JSON,
            defaultValue: "{}",
            allowNull: false,
        }
    }, {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
    })
}
    