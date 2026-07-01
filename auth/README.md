# Сервис авторизации

## Alembic

### Инициализировать окружении миграций (если нет директории alembic)
```alembic init alembic```

### Насройка  
В ```alembic.ini``` установить database connection string в ```sqlalchemy.url``` переменную из ```sqlalchemy.create_engine()```.

В ```alembic/env.py``` присвоить SQLAlchemy MetaData instance (или Declarative Base) target_metadata переменной. Это обязательно для автогенерации.

Например
```
from pathlib import Path
import sys
# 1. Get the directory of the current script
current_dir = Path(__file__).resolve().parent

# 2. Navigate up to the root and over to the target parent folder
#    (Adjust '.parent' chains depending on how deep your script is nested)
target_parent_path = current_dir.parent.parent

# 3. Cast to string and insert into sys.path
sys.path.insert(0, str(target_parent_path))

from auth.models import OrmBase

target_metadata = OrmBase.metadata
```

Сгенерировать миграцию  
```alembic revision --autogenerate -m "\<revision name\>"```

Выполнить все новые миграции  
```alembic upgrade head```

## Fastapi

Для запуска сервера в режиме разработки ```fastapi dev``` с учетом, что приложение в модуле ```main.py```.  
Для запуска в прод режиме ```fastapi run main.py```.  

### Для заупска с указанием порта

Установить uvcorn  ```pip install "uvicorn[standard]"```.  
Запустить сервер ```uvicorn main:app --host 0.0.0.0 --port 80```, где ```main``` путь к модулю, ```app``` - инстанс приложения в модуле.  
