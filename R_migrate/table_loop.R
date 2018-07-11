library(neotoma)

tbls <- neotoma::get_table()

for(i in tbls){
  tables <- neotoma::get_table(i)
}

require("RPostgreSQL")

pw <- {
  "postgres"
}

# loads the PostgreSQL driver
drv <- dbDriver("PostgreSQL")
# creates a connection to the postgres database
# note that "con" will be used later in each connection to the database
con <- dbConnect(drv, dbname = "neotoma-dev",
                 host = "localhost", port = 5432,
                 user = "postgres", password = pw)
rm(pw) # removes the password

for (i in tbls) {
  if (!dbExistsTable(con, i)) {
    tables <- try(neotoma::get_table(i))
    
    if (! "try-error" %in% class(tables) & !identical(tables, tbls)) {
    
      dbWriteTable(con, i, 
                   value = tables, append = TRUE, row.names = FALSE)
    }
  }
  flush.console()
  cat(i, "\n")
  
}

