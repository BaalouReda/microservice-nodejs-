-- CreateTable
CREATE TABLE "Etudiant" (
    "id" SERIAL NOT NULL,
    "cin" TEXT NOT NULL,
    "cne" TEXT NOT NULL,
    "note_mathematique" DOUBLE PRECISION NOT NULL,
    "note_physique" DOUBLE PRECISION NOT NULL,
    "note_arabe" DOUBLE PRECISION NOT NULL,
    "note_anglais" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_cin_key" ON "Etudiant"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_cne_key" ON "Etudiant"("cne");
