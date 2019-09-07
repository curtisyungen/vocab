module.exports = function(sequelize, DataTypes) {
    let Words = sequelize.define("Words", {
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        word: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        definition: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        synonyms: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        wrong: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sentence: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    
    return Words;
}
