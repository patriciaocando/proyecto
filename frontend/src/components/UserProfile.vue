<template>
  <div>
    <h2>DATOS PERSONALES:</h2>

    <div v-show="noEdit">
      <img :src="userdata.avatar" />

      <h3>USERANAME:</h3>
      <p>{{ userdata.username }}</p>
      <h3>NOMBRE:</h3>
      <p>{{ userdata.name }} {{ userdata.lastName }}</p>
      <h3>ROL:</h3>
      <p>{{ userdata.role}}</p>
      <h3>EMAIL:</h3>
      <p>{{ userdata.email }}</p>
      <h3>BIO:</h3>
      <p>{{ userdata.profile }}</p>
      <button @click="seeProfile()">Editar Perfil</button>
    </div>

    <div v-show="edit">
      <img :src="userdata.avatar" />
      <input type="file" ref="avatarLoad" @change="getImageUpload" />
      <!--  <button @click="updateProfile()">Subir imagen</button>
      -->
      <p>{{avatarLoad.name}}</p>
      <h3>USERANAME:</h3>
      <input type="text" v-model="newUsername" />

      <h3>NOMBRE:</h3>
      <input type="text" v-model="newName" />
      <h3>APELLIDO:</h3>
      <input type="text" v-model="newLastname" />
      <h3>EMAIL:</h3>
      <input type="text" v-model="newEmail" />
      <h3>BIO:</h3>
      <input type="textarea" v-model="newBio" />
      <button @click="updateProfile()">Guardar Perfil</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  props: {
    userdata: Object,
  },
  data() {
    return {
      newUsername: "",
      newName: "",
      newLastname: "",
      newEmail: "",
      newBio: "",
      id: "",
      avatar: this.userdata.avatar,
      avatarLoad: "",

      noEdit: true,
      edit: false,
    };
  },
  methods: {
    getImageUpload() {
      this.avatarLoad = this.$refs.avatarLoad.files[0];
      console.log("avatar", this.avatarLoad);
    },

    seeProfile() {
      this.noEdit = false;
      this.edit = true;

      this.newUsername = this.userdata.username;
      this.newName = this.userdata.name;
      this.newLastname = this.userdata.lastName;
      this.newEmail = this.userdata.email;
      this.newBio = this.userdata.profile;
      this.id = this.userdata.id;
    },
    updateProfile() {
      const userData = {
        name: this.newName,
        lastname: this.newLastname,
        username: this.newUsername,
        email: this.newEmail,
        profile: this.newBio,
        id: this.userdata.id,
        avatar: this.avatarLoad,
      };
      this.$emit("iduserupdate", userData);
    },
  },
};
</script>

<style scoped></style>
