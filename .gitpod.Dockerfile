# syntax=docker.io/docker/dockerfile:1.9.0
FROM yeongsheng/doughnut-gitpod:2024-08-19

# -----------------------------------------------------
# -------------------- USER gitpod --------------------
# -----------------------------------------------------

# Setup gitpod workspace user
CMD /bin/bash -l
USER gitpod
ENV USER gitpod
WORKDIR /home/gitpod

# activate nix
ENV PATH="${PATH}:/nix/var/nix/profiles/default/bin"
RUN export PATH="${PATH}:/nix/var/nix/profiles/default/bin"
# upgrade to lix
RUN . /home/gitpod/.nix-profile/etc/profile.d/nix.sh \
# install direnv
    && nix-env -iA nixpkgs.direnv && nix-env -iA nixpkgs.nix-direnv && nix-env -iA nixpkgs.lix

# fasd
RUN echo 'eval "$(fasd --init auto)"' >> ~/.bashrc
RUN echo 'eval "$(fasd --init auto)"' >> ~/.zshrc

# direnv
RUN echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
RUN echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
