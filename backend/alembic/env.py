from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
from pydantic_settings import BaseSettings

# Import your models here
from models import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

# Determine which environment file to use


def get_env_file():
    """Determine which environment file to use based on environment"""
    # Check for explicit environment setting
    if os.getenv("NODE_ENV") == "production" or os.getenv("ENVIRONMENT") == "production":
        return ".env.production"
    elif os.getenv("VERCEL_ENV") or os.getenv("RAILWAY_ENVIRONMENT"):
        # Vercel and Railway deployments
        return ".env.production"
    else:
        # Default to local development
        return ".env"


class Settings(BaseSettings):
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "password"
    MYSQL_HOST: str = "localhost"
    MYSQL_DATABASE: str = "react_form"

    class Config:
        env_file = get_env_file()


def get_url():
    settings = Settings()
    return f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}/{settings.MYSQL_DATABASE}"


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
