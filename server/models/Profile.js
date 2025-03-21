module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isNumeric: true,
                len: [8,15] // Ensure a valid phone number length
            }
        },
        profile_picture: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'profiles', // Ensure this matches your actual table name
        timestamps: true // Enable createdAt & updatedAt timestamps
    });

    // Associations
    Profile.associate = (models) => {
        Profile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'User',
        });
    };

    return Profile;
};