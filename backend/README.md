### Packages

1. mongoose-data-seed (https://www.npmjs.com/package/mongoose-data-seed):

- Ask you to choose a folder for your seeders.

  ```properties
    make md-seed-init
  ```

- Generate seeder file

  ```properties
  make gen-md-seed name="users"
  ```

- Run all seeders

  ```properties
  md-seed run | make run-seeders
  ```

- Run specific seeders

  ```properties
  md-seed run users posts comments | make run-seeder seeder_name="users posts comments"
  ```
