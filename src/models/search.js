// mysql searchs 테이블 (출처 및 검색 결과 저장 용도) 생성

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("search", {
        idx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        origin_host: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        keyword: {
            type: DataTypes.STRING(300),
            allowNull: false,
        }
    }, {
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: false,
    })
}