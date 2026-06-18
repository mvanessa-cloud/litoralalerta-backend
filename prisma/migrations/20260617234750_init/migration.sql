-- CreateTable
CREATE TABLE `comentario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conteudo` TEXT NOT NULL,
    `data` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `usuarioId` INTEGER UNSIGNED NOT NULL,
    `publicacaoId` INTEGER UNSIGNED NOT NULL,

    INDEX `Comentario_publicacaoId_fkey`(`publicacaoId`),
    INDEX `Comentario_usuarioId_fkey`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curtir` (
    `publicacaoId` INTEGER UNSIGNED NOT NULL,
    `usuarioId` INTEGER UNSIGNED NOT NULL,
    `data` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `Curtir_usuarioId_fkey`(`usuarioId`),
    PRIMARY KEY (`publicacaoId`, `usuarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataCadastro` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Newsletter_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicacao` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `resumo` VARCHAR(255) NULL,
    `slug` VARCHAR(255) NULL,
    `conteudo` TEXT NULL,
    `fotoCapa` VARCHAR(255) NULL,
    `acessos` INTEGER NOT NULL DEFAULT 0,
    `tipo` VARCHAR(45) NULL,
    `dataPublicacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `usuarioId` INTEGER UNSIGNED NOT NULL,

    INDEX `Publicacao_usuarioId_fkey`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seguir` (
    `seguidorId` INTEGER UNSIGNED NOT NULL,
    `seguidoId` INTEGER UNSIGNED NOT NULL,
    `data` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`seguidorId`, `seguidoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `nome` VARCHAR(50) NULL,
    `fotoPerfil` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `senha` VARCHAR(80) NULL,
    `tipo` VARCHAR(45) NULL,
    `bio` VARCHAR(255) NULL,
    `local` VARCHAR(50) NULL,
    `dataCadastro` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Usuario_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `Comentario_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `publicacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `Comentario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curtir` ADD CONSTRAINT `Curtir_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `publicacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curtir` ADD CONSTRAINT `Curtir_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicacao` ADD CONSTRAINT `Publicacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seguir` ADD CONSTRAINT `Seguir_seguidorId_fkey` FOREIGN KEY (`seguidorId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
