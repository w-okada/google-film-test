tar cvf model.tar model/
split -b 10m -a 2 model.tar model.tar-
rm model.tar
